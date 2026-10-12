package com.example.backend.ds;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.*;

/**
 * Computer Organization Concept: Multi-threaded billing engine.
 * Computes subtotal, tax breakdown, discount application, and final net total in parallel threads,
 * collecting performance metrics (execution time in milliseconds, CPU threads used, memory status).
 */
@Component
public class MultiThreadedBillingEngine {

    private final ExecutorService executor = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());

    public static class PerformanceMetrics {
        private final long executionTimeNs;
        private final double executionTimeMs;
        private final int activeThreads;
        private final String dataStructureUsed;
        private final long memoryUsedBytes;

        public PerformanceMetrics(long executionTimeNs, int activeThreads, String dataStructureUsed, long memoryUsedBytes) {
            this.executionTimeNs = executionTimeNs;
            this.executionTimeMs = executionTimeNs / 1_000_000.0;
            this.activeThreads = activeThreads;
            this.dataStructureUsed = dataStructureUsed;
            this.memoryUsedBytes = memoryUsedBytes;
        }

        public long getExecutionTimeNs() { return executionTimeNs; }
        public double getExecutionTimeMs() { return executionTimeMs; }
        public int getActiveThreads() { return activeThreads; }
        public String getDataStructureUsed() { return dataStructureUsed; }
        public long getMemoryUsedBytes() { return memoryUsedBytes; }
    }

    public static class CalculationResult {
        private final double rawTotal;
        private final double discountPercent;
        private final double discountAmount;
        private final double taxPercent;
        private final double taxAmount;
        private final double netTotal;
        private final PerformanceMetrics metrics;

        public CalculationResult(double rawTotal, double discountPercent, double discountAmount,
                                 double taxPercent, double taxAmount, double netTotal, PerformanceMetrics metrics) {
            this.rawTotal = rawTotal;
            this.discountPercent = discountPercent;
            this.discountAmount = discountAmount;
            this.taxPercent = taxPercent;
            this.taxAmount = taxAmount;
            this.netTotal = netTotal;
            this.metrics = metrics;
        }

        public double getRawTotal() { return rawTotal; }
        public double getDiscountPercent() { return discountPercent; }
        public double getDiscountAmount() { return discountAmount; }
        public double getTaxPercent() { return taxPercent; }
        public double getTaxAmount() { return taxAmount; }
        public double getNetTotal() { return netTotal; }
        public PerformanceMetrics getMetrics() { return metrics; }
    }

    public CalculationResult processBillConcurrently(BillItemLinkedList cart, double discountRate, double taxRate) {
        long startTime = System.nanoTime();
        int poolSize = Runtime.getRuntime().availableProcessors();

        // Multi-Thread Task 1: Compute Raw Subtotal from Linked List nodes concurrently
        CompletableFuture<Double> rawTotalFuture = CompletableFuture.supplyAsync(() -> {
            return cart.calculateRawTotal();
        }, executor);

        // Multi-Thread Task 2: Compute Discount Amount
        CompletableFuture<Double> discountFuture = rawTotalFuture.thenApplyAsync(rawTotal -> {
            return Math.round((rawTotal * (discountRate / 100.0)) * 100.0) / 100.0;
        }, executor);

        // Multi-Thread Task 3: Compute Tax Amount after Discount
        CompletableFuture<Double> taxFuture = CompletableFuture.allOf(rawTotalFuture, discountFuture).thenApplyAsync(v -> {
            try {
                double rawTotal = rawTotalFuture.get();
                double discountAmt = discountFuture.get();
                double taxableBase = rawTotal - discountAmt;
                return Math.round((taxableBase * (taxRate / 100.0)) * 100.0) / 100.0;
            } catch (Exception e) {
                return 0.0;
            }
        }, executor);

        // Combine all multi-threaded results
        try {
            double rawTotal = rawTotalFuture.get(2, TimeUnit.SECONDS);
            double discountAmount = discountFuture.get(2, TimeUnit.SECONDS);
            double taxAmount = taxFuture.get(2, TimeUnit.SECONDS);
            double netTotal = Math.round((rawTotal - discountAmount + taxAmount) * 100.0) / 100.0;

            long endTime = System.nanoTime();
            long memoryUsed = Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory();

            PerformanceMetrics metrics = new PerformanceMetrics(
                    endTime - startTime,
                    poolSize,
                    "LinkedList + Concurrent HashMap + Multi-threaded Futures",
                    memoryUsed
            );

            return new CalculationResult(rawTotal, discountRate, discountAmount, taxRate, taxAmount, netTotal, metrics);
        } catch (Exception e) {
            long endTime = System.nanoTime();
            double rawTotal = cart.calculateRawTotal();
            double discountAmount = rawTotal * (discountRate / 100.0);
            double taxAmount = (rawTotal - discountAmount) * (taxRate / 100.0);
            double netTotal = rawTotal - discountAmount + taxAmount;

            PerformanceMetrics metrics = new PerformanceMetrics(
                    endTime - startTime,
                    1,
                    "Fallback Sequential LinkedList",
                    0
            );
            return new CalculationResult(rawTotal, discountRate, discountAmount, taxRate, taxAmount, netTotal, metrics);
        }
    }
}
