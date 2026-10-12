package com.example.backend.ds;

import java.util.ArrayList;
import java.util.List;

/**
 * Custom Linked List implementation for dynamic cart item management.
 * Demonstrates pointer-based node insertion, dynamic deletion, and sequential traversal.
 * As highlighted on the BillMaster Poster: "Data Structures: Linked Lists for dynamic cart storage".
 */
public class BillItemLinkedList {

    public static class Node {
        private Long productId;
        private String productCode;
        private String productName;
        private Double unitPrice;
        private Integer quantity;
        private Double subtotal;
        private Node next;

        public Node(Long productId, String productCode, String productName, Double unitPrice, Integer quantity) {
            this.productId = productId;
            this.productCode = productCode;
            this.productName = productName;
            this.unitPrice = unitPrice;
            this.quantity = quantity;
            this.subtotal = unitPrice * quantity;
            this.next = null;
        }

        public Long getProductId() { return productId; }
        public String getProductCode() { return productCode; }
        public String getProductName() { return productName; }
        public Double getUnitPrice() { return unitPrice; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
            this.subtotal = this.unitPrice * quantity;
        }
        public Double getSubtotal() { return subtotal; }
        public Node getNext() { return next; }
        public void setNext(Node next) { this.next = next; }
    }

    private Node head;
    private int size;

    public BillItemLinkedList() {
        this.head = null;
        this.size = 0;
    }

    /**
     * Add node to the end of the Linked List
     */
    public synchronized void addOrUpdate(Long productId, String productCode, String productName, Double unitPrice, int qtyDelta) {
        if (head == null) {
            head = new Node(productId, productCode, productName, unitPrice, Math.max(1, qtyDelta));
            size++;
            return;
        }

        Node current = head;
        Node prev = null;
        while (current != null) {
            if (current.getProductId().equals(productId)) {
                int newQty = current.getQuantity() + qtyDelta;
                if (newQty <= 0) {
                    remove(productId);
                } else {
                    current.setQuantity(newQty);
                }
                return;
            }
            prev = current;
            current = current.getNext();
        }

        // Product not in linked list, append new node
        Node newNode = new Node(productId, productCode, productName, unitPrice, qtyDelta);
        if (prev != null) {
            prev.setNext(newNode);
        }
        size++;
    }

    /**
     * Remove node by product ID
     */
    public synchronized boolean remove(Long productId) {
        if (head == null) return false;

        if (head.getProductId().equals(productId)) {
            head = head.getNext();
            size--;
            return true;
        }

        Node current = head;
        while (current.getNext() != null) {
            if (current.getNext().getProductId().equals(productId)) {
                current.setNext(current.getNext().getNext());
                size--;
                return true;
            }
            current = current.getNext();
        }
        return false;
    }

    /**
     * Calculate total subtotal by traversing linked list nodes sequentially
     */
    public double calculateRawTotal() {
        double total = 0.0;
        Node current = head;
        while (current != null) {
            total += current.getSubtotal();
            current = current.getNext();
        }
        return total;
    }

    /**
     * Convert Linked List to Array / Standard List for serialization
     */
    public List<Node> toList() {
        List<Node> list = new ArrayList<>();
        Node current = head;
        while (current != null) {
            list.add(current);
            current = current.getNext();
        }
        return list;
    }

    public int getSize() {
        return size;
    }

    public Node getHead() {
        return head;
    }
}
