package com.example.backend.ds;

import com.example.backend.entity.Product;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Demonstrates Hash Map Data Structure for O(1) inventory cache lookups.
 * As highlighted on the BillMaster Poster: "Data Structures: Hash Maps for fast retrieval".
 */
@Component
public class ProductCatalogCache {

    private final ConcurrentHashMap<String, Product> productMapByCode = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<Long, Product> productMapById = new ConcurrentHashMap<>();

    public void put(Product product) {
        if (product != null) {
            if (product.getItemCode() != null) {
                productMapByCode.put(product.getItemCode().toUpperCase(), product);
            }
            if (product.getId() != null) {
                productMapById.put(product.getId(), product);
            }
        }
    }

    public Product getByCode(String code) {
        if (code == null) return null;
        return productMapByCode.get(code.toUpperCase());
    }

    public Product getById(Long id) {
        if (id == null) return null;
        return productMapById.get(id);
    }

    public void clear() {
        productMapByCode.clear();
        productMapById.clear();
    }

    public Collection<Product> getAll() {
        return productMapById.values();
    }

    public int size() {
        return productMapById.size();
    }
}
