package com.example.backend.service;

import com.example.backend.ds.BillItemLinkedList;
import com.example.backend.ds.MultiThreadedBillingEngine;
import com.example.backend.dto.*;
import com.example.backend.entity.Bill;
import com.example.backend.entity.BillItem;
import com.example.backend.entity.Customer;
import com.example.backend.entity.Product;
import com.example.backend.enums.CustomerType;
import com.example.backend.enums.PaymentStatus;
import com.example.backend.repository.BillRepository;
import com.example.backend.repository.CustomerRepository;
import com.example.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BillingService {

    private final ProductService productService;
    private final CustomerRepository customerRepository;
    private final BillRepository billRepository;
    private final ProductRepository productRepository;
    private final MultiThreadedBillingEngine billingEngine;

    @Autowired
    public BillingService(ProductService productService,
                          CustomerRepository customerRepository,
                          BillRepository billRepository,
                          ProductRepository productRepository,
                          MultiThreadedBillingEngine billingEngine) {
        this.productService = productService;
        this.customerRepository = customerRepository;
        this.billRepository = billRepository;
        this.productRepository = productRepository;
        this.billingEngine = billingEngine;
    }

    /**
     * Workflow Step 2: Calculate Total Amount using Linked List & Multi-threading Engine
     */
    public BillCalculationDTO calculateBill(BillRequestDTO request) {
        // Step 1 DS: Build Linked List of cart items
        BillItemLinkedList cartLinkedList = new BillItemLinkedList();

        if (request.getItems() != null) {
            for (BillItemRequestDTO itemReq : request.getItems()) {
                if (itemReq.getProductId() != null && itemReq.getQuantity() != null && itemReq.getQuantity() > 0) {
                    Product product = productService.getProductById(itemReq.getProductId());
                    cartLinkedList.addOrUpdate(
                            product.getId(),
                            product.getItemCode(),
                            product.getName(),
                            product.getPrice(),
                            itemReq.getQuantity()
                    );
                }
            }
        }

        double discount = request.getDiscountPercent() != null ? request.getDiscountPercent() : 0.0;
        double tax = request.getTaxPercent() != null ? request.getTaxPercent() : 10.0;

        // Step 2 CO & DS: Multi-threaded billing computation
        MultiThreadedBillingEngine.CalculationResult result = billingEngine.processBillConcurrently(
                cartLinkedList, discount, tax
        );

        // Map items from linked list nodes
        List<BillCalculationDTO.BillItemResponseDTO> itemDTOs = new ArrayList<>();
        BillItemLinkedList.Node node = cartLinkedList.getHead();
        while (node != null) {
            itemDTOs.add(new BillCalculationDTO.BillItemResponseDTO(
                    node.getProductId(),
                    node.getProductCode(),
                    node.getProductName(),
                    node.getUnitPrice(),
                    node.getQuantity(),
                    node.getSubtotal()
            ));
            node = node.getNext();
        }

        BillCalculationDTO calcDTO = new BillCalculationDTO();
        calcDTO.setRawTotal(result.getRawTotal());
        calcDTO.setDiscountPercent(result.getDiscountPercent());
        calcDTO.setDiscountAmount(result.getDiscountAmount());
        calcDTO.setTaxPercent(result.getTaxPercent());
        calcDTO.setTaxAmount(result.getTaxAmount());
        calcDTO.setNetTotal(result.getNetTotal());
        calcDTO.setItems(itemDTOs);
        calcDTO.setMetrics(result.getMetrics());

        return calcDTO;
    }

    /**
     * Workflow Step 3: Generate and Finalize Bill
     */
    @Transactional
    public BillResponseDTO generateBill(BillRequestDTO request) {
        Customer customer;
        if (request.getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomerId())
                    .orElseGet(() -> createOrUpdateCustomer(request));
        } else {
            customer = createOrUpdateCustomer(request);
        }

        BillCalculationDTO calc = calculateBill(request);

        Bill bill = new Bill();
        bill.setBillNumber("BM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        bill.setCustomer(customer);
        bill.setRawTotal(calc.getRawTotal());
        bill.setDiscountPercent(calc.getDiscountPercent());
        bill.setDiscountAmount(calc.getDiscountAmount());
        bill.setTaxPercent(calc.getTaxPercent());
        bill.setTaxAmount(calc.getTaxAmount());
        bill.setNetAmount(calc.getNetTotal());
        bill.setPaymentStatus(PaymentStatus.PAID);
        bill.setCreatedAt(LocalDateTime.now());

        if (calc.getItems() != null) {
            for (BillCalculationDTO.BillItemResponseDTO itemDTO : calc.getItems()) {
                Product product = productService.getProductById(itemDTO.getProductId());
                
                // Deduct stock if available
                if (product.getStockQuantity() != null && product.getStockQuantity() >= itemDTO.getQuantity()) {
                    product.setStockQuantity(product.getStockQuantity() - itemDTO.getQuantity());
                    productRepository.save(product);
                }

                BillItem billItem = new BillItem(product, itemDTO.getQuantity(), itemDTO.getUnitPrice(), itemDTO.getSubtotal());
                bill.addItem(billItem);
            }
        }

        Bill savedBill = billRepository.save(bill);
        return mapToResponseDTO(savedBill, calc.getMetrics());
    }

    private Customer createOrUpdateCustomer(BillRequestDTO request) {
        String name = request.getCustomerName() != null ? request.getCustomerName() : "Walk-in Customer";
        String email = request.getCustomerEmail() != null ? request.getCustomerEmail() : "guest-" + System.currentTimeMillis() + "@billmaster.com";
        String phone = request.getCustomerPhone() != null ? request.getCustomerPhone() : "N/A";

        return customerRepository.findByEmail(email).orElseGet(() -> {
            Customer newCust = new Customer(name, email, phone, CustomerType.REGULAR);
            return customerRepository.save(newCust);
        });
    }

    public List<BillResponseDTO> getAllBills() {
        return billRepository.findAll().stream()
                .map(bill -> mapToResponseDTO(bill, null))
                .collect(Collectors.toList());
    }

    public BillResponseDTO getBillById(Long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found with id: " + id));
        return mapToResponseDTO(bill, null);
    }

    private BillResponseDTO mapToResponseDTO(Bill bill, MultiThreadedBillingEngine.PerformanceMetrics metrics) {
        BillResponseDTO dto = new BillResponseDTO();
        dto.setId(bill.getId());
        dto.setBillNumber(bill.getBillNumber());

        Customer c = bill.getCustomer();
        dto.setCustomer(new CustomerDTO(c.getId(), c.getName(), c.getEmail(), c.getPhone(), c.getCustomerType()));

        List<BillCalculationDTO.BillItemResponseDTO> items = bill.getItems().stream()
                .map(item -> new BillCalculationDTO.BillItemResponseDTO(
                        item.getProduct().getId(),
                        item.getProduct().getItemCode(),
                        item.getProduct().getName(),
                        item.getUnitPrice(),
                        item.getQuantity(),
                        item.getSubtotal()
                ))
                .collect(Collectors.toList());
        dto.setItems(items);

        dto.setRawTotal(bill.getRawTotal());
        dto.setDiscountPercent(bill.getDiscountPercent());
        dto.setDiscountAmount(bill.getDiscountAmount());
        dto.setTaxPercent(bill.getTaxPercent());
        dto.setTaxAmount(bill.getTaxAmount());
        dto.setNetAmount(bill.getNetAmount());
        dto.setPaymentStatus(bill.getPaymentStatus());
        dto.setCreatedAt(bill.getCreatedAt());
        dto.setMetrics(metrics);

        return dto;
    }
}
