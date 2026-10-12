package com.example.backend.dto;

import java.util.List;

public class BillRequestDTO {
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;

    private List<BillItemRequestDTO> items;
    private Double discountPercent = 0.0;
    private Double taxPercent = 10.0;

    public BillRequestDTO() {}

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public List<BillItemRequestDTO> getItems() { return items; }
    public void setItems(List<BillItemRequestDTO> items) { this.items = items; }

    public Double getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(Double discountPercent) { this.discountPercent = discountPercent; }

    public Double getTaxPercent() { return taxPercent; }
    public void setTaxPercent(Double taxPercent) { this.taxPercent = taxPercent; }
}
