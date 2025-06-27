package com.smartfarm.backendms1.service.facade;

import com.smartfarm.backendms1.bean.Product;

import java.util.List;

public interface ProductService {
    int ProductService(Product product);

    List<Product> findAll();
    Product findById(Long id);

    public int save(Product product);

    boolean deleteById(Long id);
}
