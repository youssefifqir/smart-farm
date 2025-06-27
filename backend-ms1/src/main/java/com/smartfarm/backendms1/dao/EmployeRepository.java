package com.smartfarm.backendms1.dao;

import com.smartfarm.backendms1.bean.Employe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface EmployeRepository extends JpaRepository<Employe, Long> {

    Employe findByEmail(String email);

    List<Employe> findByPoste(String poste);

    List<Employe> findAllByOrderByNomAsc();
    List<Employe> findBySalaireGreaterThan(BigDecimal salaireMin);
}
