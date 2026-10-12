package com.example.backend.dto;

import com.example.backend.ds.MultiThreadedBillingEngine;
import java.util.List;

public class BillCalculationDTO {
    private Double rawTotal;
    private Double discountPercent;
    private Double discountAmount;
    private Double taxPercent;
    private Double taxAmount;
    private Double netTotal;
    private List<BillItemResponseDTO> items;
    private MultiThreadedBillingEngine.PerformanceMetrics metrics;

    public BillCalculationDTO() {}

    public static class BillItemResponseDTO {
        private Long productId;
        private String itemCode;
        private String productName;
        private Double unitPrice;
        private Integer quantity;
        private Double subtotal;

        public BillItemResponseDTO(Long productId, String itemCode, String productName, Double unitPrice, Integer quantity, Double subtotal) {
            this.productId = productId;
            this.itemCode = itemCode;
            this.productName = productName;
            this.unitPrice = unitPrice;
            this.quantity = quantity;
            this.subtotal = subtotal;
        }

        public Long getProductId() { return productId; }
        public String getItemCode() { return itemCode; }
        public String getProductName() { return productName; }
        public Double getUnitPrice() { return unitPrice; }
        public Integer getQuantity() { return quantity; }
        public Double getSubtotal() { return subtotal; }
    }

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

    public Double getNetTotal() { return netTotal; }
    public void setNetTotal(Double netTotal) { this.netTotal = netTotal; }

    public List<BillItemResponseDTO> getItems() { return items; }
    public void setItems(List<BillItemResponseDTO> items) { this.items = items; }

    public MultiThreadedBillingEngine.PerformanceMetrics getMetrics() { return metrics; }
    public void setMetrics(MultiThreadedBillingEngine.PerformanceMetrics metrics) { this.metrics = metrics; }
}
