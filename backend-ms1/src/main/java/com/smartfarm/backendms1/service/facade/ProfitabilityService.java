package com.smartfarm.backendms1.service.facade;

import com.smartfarm.backendms1.bean.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ProfitabilityService {

    /**
     * Générer un rapport de rentabilité quotidien basé sur les données de consommation
     * @param date Date pour laquelle générer le rapport
     * @return Le rapport de rentabilité généré
     */
    ProfitabilityReport generateDailyReport(LocalDate date);

    /**
     * Récupérer un rapport par son ID
     * @param id ID du rapport
     * @return Le rapport s'il existe
     */
    Optional<ProfitabilityReport> getReportById(Long id);

    /**
     * Récupérer tous les rapports
     * @return Liste de tous les rapports
     */
    List<ProfitabilityReport> getAllReports();

    /**
     * Récupérer les rapports entre deux dates
     * @param startDate Date de début
     * @param endDate Date de fin
     * @return Liste des rapports dans cet intervalle
     */
    List<ProfitabilityReport> getReportsByDateRange(LocalDate startDate, LocalDate endDate);

    /**
     * Calculer le ROI (Return on Investment) du système IoT
     * @param startDate Date de début pour le calcul
     * @param endDate Date de fin pour le calcul
     * @return Le ROI en pourcentage
     */
    double calculateROI(LocalDate startDate, LocalDate endDate);
    List<ProfitabilityReport> getReportsByProfitGreaterThan(double minProfit);

    /**
     * Récupérer les rapports avec un profit inférieur à une valeur donnée
     * @param maxProfit Valeur maximale du profit
     * @return Liste des rapports avec un profit inférieur à la valeur spécifiée
     */
    List<ProfitabilityReport> getReportsByProfitLessThan(double maxProfit);

    ProfitabilityReport generateMonthlyReport(YearMonth yearMonth);
    List<MonthlyFinancial> getMonthlyFinancialData(int year);
    List<ResourceUsage> getResourceUsageData(LocalDate startDate, LocalDate endDate);
    List<CropProfitability> getCropProfitabilityData(LocalDate startDate, LocalDate endDate);
    List<WaterEfficiency> getWaterEfficiencyData();
    Map<String, Object> getDashboardKPIs(LocalDate startDate, LocalDate endDate);
    List<WeeklyFinancial> getWeeklyFinancialData();
    List<YearlyFinancial> getYearlyFinancialData();
}