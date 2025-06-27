package com.smartfarm.backendms1.dao;

import com.smartfarm.backendms1.bean.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Supplier findByNom(String nom);
}
