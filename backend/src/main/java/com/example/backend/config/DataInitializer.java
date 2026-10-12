package com.example.backend.config;

import com.example.backend.ds.ProductCatalogCache;
import com.example.backend.entity.Customer;
import com.example.backend.entity.Product;
import com.example.backend.enums.CustomerType;
import com.example.backend.repository.CustomerRepository;
import com.example.backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(ProductRepository productRepository,
                                       CustomerRepository customerRepository,
                                       ProductCatalogCache catalogCache) {
        return args -> {
            // Re-initialize products if count is 0 or updating to INR
            if (productRepository.count() == 0) {
                List<Product> products = Arrays.asList(
                        new Product("PRD-101", "MacBook Pro M3 Max 16\"", "Electronics", 249999.00, 15),
                        new Product("PRD-102", "Dell UltraSharp 27\" 4K Monitor", "Electronics", 49999.00, 25),
                        new Product("PRD-103", "Logitech MX Master 3S Wireless Mouse", "Accessories", 8999.00, 50),
                        new Product("PRD-104", "Keychron K2 Mechanical Keyboard", "Accessories", 7499.00, 40),
                        new Product("PRD-105", "Sony WH-1000XM5 Wireless Headphones", "Audio", 29990.00, 20),
                        new Product("PRD-106", "Samsung T7 2TB External SSD", "Storage", 14999.00, 30),
                        new Product("PRD-107", "Anker 100W USB-C Fast Charger", "Accessories", 3999.00, 60),
                        new Product("PRD-108", "Ergonomic Mesh Office Chair", "Furniture", 24900.00, 10),
                        new Product("PRD-109", "JetBrains All Products Pack License (1 Yr)", "Software", 22500.00, 100),
                        new Product("PRD-110", "HyperX QuadCast S USB Microphone", "Audio", 11490.00, 18)
                );

                List<Product> savedProducts = productRepository.saveAll(products);
                savedProducts.forEach(catalogCache::put);
            }

            if (customerRepository.count() == 0) {
                List<Customer> customers = Arrays.asList(
                        new Customer("Alex Johnson", "alex.johnson@example.com", "+91 98765-43210", CustomerType.PREMIUM),
                        new Customer("Priya Sharma", "priya.sharma@example.com", "+91 98123-45678", CustomerType.VIP),
                        new Customer("TechCorp Ltd India", "billing@techcorp.in", "+91 80-23456789", CustomerType.WHOLESALE),
                        new Customer("Rahul Verma", "rahul.verma@example.com", "+91 97110-22334", CustomerType.REGULAR)
                );
                customerRepository.saveAll(customers);
            }
        };
    }
}
