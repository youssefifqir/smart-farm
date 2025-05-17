package com.smartfarm.backendms1.service.impl;

import com.smartfarm.backendms1.bean.Product;
import com.smartfarm.backendms1.bean.SensorData;
import com.smartfarm.backendms1.dao.ProductRepository;
import com.smartfarm.backendms1.service.facade.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public int ProductService(Product product) {
        return 0;
    }

    @Override
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public Product findById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public int save(Product product) {
        try {
            productRepository.save(product);
            return 1; // success
        } catch (Exception e) {
            e.printStackTrace();
            return 0; // failure
        }
    }
    @Override
    public boolean deleteById(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
