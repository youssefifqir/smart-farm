package com.smartfarm.backendms1.service.impl;

import com.smartfarm.backendms1.bean.Supplier;
import com.smartfarm.backendms1.dao.SupplierRepository;
import com.smartfarm.backendms1.service.facade.SupplierService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierServiceImpl(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Override
    public List<Supplier> findAll() {
        return supplierRepository.findAll();
    }

    @Override
    public Supplier findById(Long id) {
        return supplierRepository.findById(id).orElse(null);
    }

    @Override
    public Supplier save(Supplier supplier) {
        if (supplier.getId() != null && supplier.getId() != 0) {
            // mise à jour
            Optional<Supplier> existing = supplierRepository.findById(supplier.getId());
            if (existing.isEmpty()) {
                throw new EntityNotFoundException("supplier non trouvé avec id " + supplier.getId());
            }
        } else {
            supplier.setId(null);
        }
        return supplierRepository.save(supplier);
    }

    @Override
    public boolean deleteById(Long id) {
        Optional<Supplier> supplier = supplierRepository.findById(id);
        if (supplier.isPresent()) {
            supplierRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
