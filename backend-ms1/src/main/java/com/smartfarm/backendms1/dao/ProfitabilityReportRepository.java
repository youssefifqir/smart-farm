package com.smartfarm.backendms1.dao;

import com.smartfarm.backendms1.bean.ProfitabilityReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProfitabilityReportRepository extends JpaRepository<ProfitabilityReport, Long> {

    // Trouver les rapports entre deux dates
    List<ProfitabilityReport> findByDateBetween(LocalDate startDate, LocalDate endDate);

    // Trouver les rapports avec un profit supérieur à une valeur donnée
    List<ProfitabilityReport> findByProfitGreaterThan(double minProfit);

    // Trouver les rapports avec un profit inférieur à une valeur donnée
    List<ProfitabilityReport> findByProfitLessThan(double maxProfit);

    // Trouver les rapports pour une date spécifique
    List<ProfitabilityReport> findByDate(LocalDate date);
}