package com.example.backend.controller;

import com.example.backend.dto.BillCalculationDTO;
import com.example.backend.dto.BillRequestDTO;
import com.example.backend.dto.BillResponseDTO;
import com.example.backend.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "*")
public class BillController {

    private final BillingService billingService;

    @Autowired
    public BillController(BillingService billingService) {
        this.billingService = billingService;
    }

    /**
     * Workflow Step 2 API: Calculate Bill total, discounts, taxes with Multi-threading engine
     */
    @PostMapping("/calculate")
    public ResponseEntity<BillCalculationDTO> calculateBill(@RequestBody BillRequestDTO request) {
        return ResponseEntity.ok(billingService.calculateBill(request));
    }

    /**
     * Workflow Step 3 API: Generate & Finalize Bill
     */
    @PostMapping("/generate")
    public ResponseEntity<BillResponseDTO> generateBill(@RequestBody BillRequestDTO request) {
        return ResponseEntity.ok(billingService.generateBill(request));
    }

    @GetMapping
    public ResponseEntity<List<BillResponseDTO>> getAllBills() {
        return ResponseEntity.ok(billingService.getAllBills());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillResponseDTO> getBillById(@PathVariable Long id) {
        return ResponseEntity.ok(billingService.getBillById(id));
    }
}
