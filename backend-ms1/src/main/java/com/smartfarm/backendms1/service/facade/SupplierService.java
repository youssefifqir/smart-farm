package com.smartfarm.backendms1.service.facade;

import com.smartfarm.backendms1.bean.Supplier;

import java.util.List;

public interface SupplierService {
    List<Supplier> findAll();
    Supplier findById(Long id);
    Supplier save(Supplier supplier);
    boolean deleteById(Long id);
}
