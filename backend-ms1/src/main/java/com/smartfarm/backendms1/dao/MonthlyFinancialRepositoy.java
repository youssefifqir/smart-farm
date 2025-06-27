package com.smartfarm.backendms1.dao;

import com.smartfarm.backendms1.bean.MonthlyFinancial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MonthlyFinancialRepositoy extends JpaRepository<MonthlyFinancial, Long> {
}
