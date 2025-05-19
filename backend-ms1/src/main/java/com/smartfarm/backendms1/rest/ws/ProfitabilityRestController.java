package com.smartfarm.backendms1.rest.ws;

import com.smartfarm.backendms1.bean.*;
import com.smartfarm.backendms1.rest.converter.ProfitabilityReportConverter;
import com.smartfarm.backendms1.rest.dto.ProfitabilityReportDto;
import com.smartfarm.backendms1.service.facade.ProfitabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/profitability")
@CrossOrigin(origins = "*")
public class ProfitabilityRestController {

    @Autowired
    private ProfitabilityService profitabilityService;

    @Autowired
    private ProfitabilityReportConverter profitabilityReportConverter;

    /**
     * Générer un rapport quotidien de rentabilité
     * @param date Date pour laquelle générer le rapport
     * @return Le rapport de rentabilité généré
     */
    @PostMapping("/generate-daily-report")
    public ResponseEntity<ProfitabilityReportDto> generateDailyReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        ProfitabilityReport report = profitabilityService.generateDailyReport(date);
        return new ResponseEntity<>(profitabilityReportConverter.toDto(report), HttpStatus.CREATED);
    }

    /**
     * Générer un rapport mensuel de rentabilité
     * @param year Année du rapport
     * @param month Mois du rapport (1-12)
     * @return Le rapport de rentabilité mensuel généré
     */
    @PostMapping("/generate-monthly-report")
    public ResponseEntity<ProfitabilityReportDto> generateMonthlyReport(
            @RequestParam int year,
            @RequestParam int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        ProfitabilityReport report = profitabilityService.generateMonthlyReport(yearMonth);

        if (report == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(profitabilityReportConverter.toDto(report), HttpStatus.CREATED);
    }

    /**
     * Récupérer un rapport par son ID
     * @param id ID du rapport à récupérer
     * @return Le rapport correspondant à l'ID s'il existe
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProfitabilityReportDto> getReportById(@PathVariable Long id) {
        Optional<ProfitabilityReport> reportOptional = profitabilityService.getReportById(id);
        return reportOptional
                .map(report -> new ResponseEntity<>(profitabilityReportConverter.toDto(report), HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Récupérer tous les rapports de rentabilité
     * @return Liste de tous les rapports
     */
    @GetMapping("/all")
    public ResponseEntity<List<ProfitabilityReportDto>> getAllReports() {
        List<ProfitabilityReport> reports = profitabilityService.getAllReports();
        return new ResponseEntity<>(profitabilityReportConverter.toDtos(reports), HttpStatus.OK);
    }

    /**
     * Récupérer les rapports entre deux dates
     * @param startDate Date de début
     * @param endDate Date de fin
     * @return Liste des rapports dans la plage de dates
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<ProfitabilityReportDto>> getReportsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<ProfitabilityReport> reports = profitabilityService.getReportsByDateRange(startDate, endDate);
        return new ResponseEntity<>(profitabilityReportConverter.toDtos(reports), HttpStatus.OK);
    }

    /**
     * Calculer le ROI (Return on Investment) du système IoT
     * @param startDate Date de début de la période
     * @param endDate Date de fin de la période
     * @return Le ROI calculé en pourcentage
     */
    @GetMapping("/roi")
    public ResponseEntity<Double> calculateROI(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        double roi = profitabilityService.calculateROI(startDate, endDate);
        return new ResponseEntity<>(roi, HttpStatus.OK);
    }

    /**
     * Récupérer les rapports pour une date spécifique
     * @param date Date spécifique
     * @return Liste des rapports pour cette date
     */
    @GetMapping("/by-date")
    public ResponseEntity<List<ProfitabilityReportDto>> getReportsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ProfitabilityReport> reports = profitabilityService.getReportsByDateRange(date, date);
        return new ResponseEntity<>(profitabilityReportConverter.toDtos(reports), HttpStatus.OK);
    }

    /**
     * Récupérer les rapports avec un profit supérieur à une valeur donnée
     * @param minProfit Valeur minimale du profit
     * @return Liste des rapports avec un profit supérieur à la valeur spécifiée
     */
    @GetMapping("/profit-greater-than")
    public ResponseEntity<List<ProfitabilityReportDto>> getReportsByProfitGreaterThan(
            @RequestParam double minProfit) {
        List<ProfitabilityReport> reports = profitabilityService.getReportsByProfitGreaterThan(minProfit);
        return new ResponseEntity<>(profitabilityReportConverter.toDtos(reports), HttpStatus.OK);
    }

    /**
     * Récupérer les rapports avec un profit inférieur à une valeur donnée
     * @param maxProfit Valeur maximale du profit
     * @return Liste des rapports avec un profit inférieur à la valeur spécifiée
     */
    @GetMapping("/profit-less-than")
    public ResponseEntity<List<ProfitabilityReportDto>> getReportsByProfitLessThan(
            @RequestParam double maxProfit) {
        List<ProfitabilityReport> reports = profitabilityService.getReportsByProfitLessThan(maxProfit);
        return new ResponseEntity<>(profitabilityReportConverter.toDtos(reports), HttpStatus.OK);
    }

    /**
     * Obtenir les données financières mensuelles pour l'affichage des graphiques
     * @param year Année pour laquelle récupérer les données
     * @return Liste des données financières mensuelles
     */
    @GetMapping("/monthly-financial-data")
    public ResponseEntity<List<MonthlyFinancial>> getMonthlyFinancialData(@RequestParam int year) {
        List<MonthlyFinancial> data = profitabilityService.getMonthlyFinancialData(year);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    /**
     * Obtenir les données de répartition des coûts par ressource
     * @param startDate Date de début
     * @param endDate Date de fin
     * @return Liste des données d'utilisation des ressources
     */
    @GetMapping("/resource-usage")
    public ResponseEntity<List<ResourceUsage>> getResourceUsageData(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<ResourceUsage> data = profitabilityService.getResourceUsageData(startDate, endDate);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    /**
     * Obtenir les données de rentabilité par type de culture
     * @param startDate Date de début
     * @param endDate Date de fin
     * @return Liste des données de rentabilité par culture
     */
    @GetMapping("/crop-profitability")
    public ResponseEntity<List<CropProfitability>> getCropProfitabilityData(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<CropProfitability> data = profitabilityService.getCropProfitabilityData(startDate, endDate);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    /**
     * Obtenir les données d'efficacité d'utilisation de l'eau par zone
     * @return Liste des données d'efficacité d'eau
     */
    @GetMapping("/water-efficiency")
    public ResponseEntity<List<WaterEfficiency>> getWaterEfficiencyData() {
        List<WaterEfficiency> data = profitabilityService.getWaterEfficiencyData();
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    /**
     * Obtenir les KPIs (Key Performance Indicators) pour le tableau de bord
     * @param startDate Date de début
     * @param endDate Date de fin
     * @return Map des KPIs avec leurs valeurs
     */
    @GetMapping("/dashboard-kpis")
    public ResponseEntity<Map<String, Object>> getDashboardKPIs(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Map<String, Object> kpis = profitabilityService.getDashboardKPIs(startDate, endDate);
        return new ResponseEntity<>(kpis, HttpStatus.OK);
    }
}