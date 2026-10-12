package com.example.backend.dto;

import com.example.backend.ds.MultiThreadedBillingEngine;
import com.example.backend.enums.PaymentStatus;

import java.time.LocalDateTime;
import java.util.List;

public class BillResponseDTO {
    private Long id;
    private String billNumber;
    private CustomerDTO customer;
    private List<BillCalculationDTO.BillItemResponseDTO> items;
    private Double rawTotal;
    private Double discountPercent;
    private Double discountAmount;
    private Double taxPercent;
    private Double taxAmount;
    private Double netAmount;
    private PaymentStatus paymentStatus;
    private LocalDateTime createdAt;
    private MultiThreadedBillingEngine.PerformanceMetrics metrics;

    public BillResponseDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBillNumber() { return billNumber; }
    public void setBillNumber(String billNumber) { this.billNumber = billNumber; }

    public CustomerDTO getCustomer() { return customer; }
    public void setCustomer(CustomerDTO customer) { this.customer = customer; }

    public List<BillCalculationDTO.BillItemResponseDTO> getItems() { return items; }
    public void setItems(List<BillCalculationDTO.BillItemResponseDTO> items) { this.items = items; }

    public Double getRawTotal() { return rawTotal; }
    public void setRawTotal(Double rawTotal) { this.rawTotal = rawTotal; }

    public Double getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(Double discountPercent) { this.discountPercent = discountPercent; }

    public Double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Double discountAmount) { this.discountAmount = discountAmount; }

    public Double getTaxPercent() { return taxPercent; }
    public void setTaxPercent(Double taxPercent) { this.taxPercent = taxPercent; }

    public Double getTaxAmount() { return taxAmount; }
    public void setTaxAmount(Double taxAmount) { this.taxAmount = taxAmount; }

    public Double getNetAmount() { return netAmount; }
    public void setNetAmount(Double netAmount) { this.netAmount = netAmount; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public MultiThreadedBillingEngine.PerformanceMetrics getMetrics() { return metrics; }
    public void setMetrics(MultiThreadedBillingEngine.PerformanceMetrics metrics) { this.metrics = metrics; }
}
