package com.example.backend.service;

import com.example.backend.ds.ProductCatalogCache;
import com.example.backend.entity.Product;
import com.example.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductCatalogCache productCatalogCache;

    @Autowired
    public ProductService(ProductRepository productRepository, ProductCatalogCache productCatalogCache) {
        this.productRepository = productRepository;
        this.productCatalogCache = productCatalogCache;
    }

    public List<Product> getAllProducts() {
        List<Product> products = productRepository.findAll();
        // Populate HashMap cache
        products.forEach(productCatalogCache::put);
        return products;
    }

    public Product getProductById(Long id) {
        // Fast O(1) HashMap lookup first
        Product cached = productCatalogCache.getById(id);
        if (cached != null) return cached;

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        productCatalogCache.put(product);
        return product;
    }

    public Product getProductByCode(String code) {
        // Fast O(1) HashMap lookup first
        Product cached = productCatalogCache.getByCode(code);
        if (cached != null) return cached;

        Product product = productRepository.findByItemCode(code)
                .orElseThrow(() -> new RuntimeException("Product not found with code: " + code));
        productCatalogCache.put(product);
        return product;
    }

    public Product saveProduct(Product product) {
        Product saved = productRepository.save(product);
        productCatalogCache.put(saved);
        return saved;
    }
}
