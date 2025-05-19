package com.smartfarm.backendms1.service.impl;

import com.smartfarm.backendms1.bean.*;
import com.smartfarm.backendms1.dao.ProfitabilityReportRepository;

import com.smartfarm.backendms1.service.facade.ProfitabilityService;
import com.smartfarm.backendms1.service.facade.ResourceConsumptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProfitabilityServiceImpl implements ProfitabilityService {

    @Autowired
    private ProfitabilityReportRepository profitabilityReportRepository;

    @Autowired
    private ResourceConsumptionService resourceConsumptionService;

    // Constantes pour les calculs financiers (à ajuster selon vos besoins)
    private static final double WATER_PRICE_PER_LITER = 0.002; // Prix de l'eau par litre
    private static final double ELECTRICITY_PRICE_PER_KWH = 0.15; // Prix de l'électricité par kWh
    private static final double MONTHLY_MAINTENANCE_COST = 50.0; // Coût mensuel d'entretien des capteurs

    /**
     * Générer un rapport de rentabilité quotidien basé sur les données de consommation
     */
    @Override
    public ProfitabilityReport generateDailyReport(LocalDate date) {
        // Récupérer les données de consommation d'eau et d'énergie
        double waterUsage = resourceConsumptionService.getWaterConsumption(date); // en litres
        double energyUsage = resourceConsumptionService.getEnergyConsumption(date); // en kWh

        // Calculer les coûts
        double waterCost = waterUsage * WATER_PRICE_PER_LITER;
        double energyCost = energyUsage * ELECTRICITY_PRICE_PER_KWH;
        double dailyMaintenanceCost = MONTHLY_MAINTENANCE_COST / 30.0;

        // Valeurs par défaut pour les nouveaux champs
        double laborCost = 150.0; // Coût journalier de main-d'œuvre
        double fertilizerCost = 75.0; // Coût journalier d'engrais
        double otherCosts = 50.0; // Autres coûts journaliers

        double totalCost = waterCost + energyCost + dailyMaintenanceCost + laborCost + fertilizerCost + otherCosts;

        // Estimer les revenus
        double estimatedRevenue = estimateRevenue(date);

        // Calculer le profit
        double profit = estimatedRevenue - totalCost;

        // Calculer la marge bénéficiaire
        double profitMargin = (profit / estimatedRevenue) * 100;

        // Créer et sauvegarder le rapport
        ProfitabilityReport report = new ProfitabilityReport();
        report.setDate(date);
        report.setWaterCost(waterCost);
        report.setEnergyCost(energyCost);
        report.setSensorMaintenanceCost(dailyMaintenanceCost);
        report.setLaborCost(laborCost);
        report.setFertilizerCost(fertilizerCost);
        report.setOtherCosts(otherCosts);
        report.setTotalCost(totalCost);
        report.setEstimatedRevenue(estimatedRevenue);
        report.setProfit(profit);
        report.setProfitMargin(profitMargin);
        report.setTimeframe("daily");

        // Par défaut, attribuer à une zone et un type de culture
        // (dans un système réel, cela serait déterminé dynamiquement)
        report.setZone(Zone.NORTH);
        report.setCropType(CropType.TOMATOES);
        report.setYieldAmount(100.0); // Production en kg

        return profitabilityReportRepository.save(report);
    }

    /**
     * Estimer les revenus basés sur les conditions environnementales et les rendements attendus
     */
    private double estimateRevenue(LocalDate date) {
        // Obtenez les conditions environnementales moyennes du jour
        double avgHumidity = resourceConsumptionService.getAverageHumidity(date);
        double avgTemperature = resourceConsumptionService.getAverageTemperature(date);
        boolean hasRained = resourceConsumptionService.hasRained(date);
        boolean hasFire = resourceConsumptionService.hasFire(date);

        // Calculez un score de santé des cultures basé sur les conditions
        double cropHealthScore = calculateCropHealthScore(avgHumidity, avgTemperature, hasRained, hasFire);

        // Calculez le revenu estimé basé sur ce score
        double baseRevenue = 200.0; // Revenu quotidien de base à ajuster
        return baseRevenue * cropHealthScore;
    }

    /**
     * Calculer un score de santé des cultures basé sur les conditions environnementales
     */
    private double calculateCropHealthScore(double humidity, double temperature, boolean hasRained, boolean hasFire) {
        // Initialiser le score à 1.0 (conditions optimales)
        double score = 1.0;


        // Impact de l'humidité (optimum entre 40% et 70%)
        if (humidity < 20) {
            score *= 0.5; // Trop sec
        } else if (humidity < 40) {
            score *= 0.8; // Un peu sec
        } else if (humidity > 90) {
            score *= 0.4; // Trop humide
        } else if (humidity > 70) {
            score *= 0.7; // Un peu humide
        }

        // Impact de la température (optimum entre 18°C et 27°C)
        if (temperature < 5) {
            score *= 0.3; // Trop froid
        } else if (temperature < 18) {
            score *= 0.7; // Un peu froid
        } else if (temperature > 35) {
            score *= 0.4; // Trop chaud
        } else if (temperature > 27) {
            score *= 0.7; // Un peu chaud
        }

        // Impact positif de la pluie (selon la saison et le type de culture)
        if (hasRained) {
            score *= 1.1; // Léger bonus pour la pluie (à ajuster selon contexte)
        }

        // Impact catastrophique d'un incendie
        if (hasFire) {
            score *= 0.1; // Perte majeure due à l'incendie
        }

        score = Math.max(0.0, Math.min(score, 1.5));

        return score;
    }

    /**
     * Récupérer un rapport par son ID
     */
    @Override
    public Optional<ProfitabilityReport> getReportById(Long id) {
        return profitabilityReportRepository.findById(id);
    }

    /**
     * Récupérer tous les rapports
     */
    @Override
    public List<ProfitabilityReport> getAllReports() {
        return profitabilityReportRepository.findAll();
    }

    /**
     * Récupérer les rapports entre deux dates
     */
    @Override
    public List<ProfitabilityReport> getReportsByDateRange(LocalDate startDate, LocalDate endDate) {
        return profitabilityReportRepository.findByDateBetween(startDate, endDate);
    }

    /**
     * Calculer le ROI (Return on Investment) du système IoT
     */
    @Override
    public double calculateROI(LocalDate startDate, LocalDate endDate) {
        // Coût total du système IoT (matériel + installation)
        double systemCost = 2000.0; // À ajuster selon votre installation

        // Calculer les profits cumulés sur la période
        List<ProfitabilityReport> reports = getReportsByDateRange(startDate, endDate);
        double totalProfit = reports.stream().mapToDouble(ProfitabilityReport::getProfit).sum();

        // Calculer le ROI
        return (totalProfit / systemCost) * 100; // en pourcentage
    }

    @Override
    public List<ProfitabilityReport> getReportsByProfitGreaterThan(double minProfit) {
        return profitabilityReportRepository.findByProfitGreaterThan(minProfit);
    }

    @Override
    public List<ProfitabilityReport> getReportsByProfitLessThan(double maxProfit) {
        return profitabilityReportRepository.findByProfitLessThan(maxProfit);
    }

    /**
     * Générer un rapport de rentabilité mensuel
     */
    @Override
    public ProfitabilityReport generateMonthlyReport(YearMonth yearMonth) {
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<ProfitabilityReport> dailyReports = getReportsByDateRange(startDate, endDate);

        if (dailyReports.isEmpty()) {
            return null;
        }

        // Agréger les données
        double totalWaterCost = dailyReports.stream().mapToDouble(ProfitabilityReport::getWaterCost).sum();
        double totalEnergyCost = dailyReports.stream().mapToDouble(ProfitabilityReport::getEnergyCost).sum();
        double totalMaintenanceCost = dailyReports.stream().mapToDouble(ProfitabilityReport::getSensorMaintenanceCost).sum();
        double totalLaborCost = dailyReports.stream().mapToDouble(r -> r.getLaborCost() != null ? r.getLaborCost() : 0).sum();
        double totalFertilizerCost = dailyReports.stream().mapToDouble(r -> r.getFertilizerCost() != null ? r.getFertilizerCost() : 0).sum();
        double totalOtherCosts = dailyReports.stream().mapToDouble(r -> r.getOtherCosts() != null ? r.getOtherCosts() : 0).sum();
        double totalCost = totalWaterCost + totalEnergyCost + totalMaintenanceCost + totalLaborCost + totalFertilizerCost + totalOtherCosts;
        double totalRevenue = dailyReports.stream().mapToDouble(ProfitabilityReport::getEstimatedRevenue).sum();
        double totalProfit = totalRevenue - totalCost;
        double avgProfitMargin = (totalProfit / totalRevenue) * 100;

        // Créer le rapport mensuel
        ProfitabilityReport monthlyReport = new ProfitabilityReport();
        monthlyReport.setDate(startDate); // Premier jour du mois
        monthlyReport.setWaterCost(totalWaterCost);
        monthlyReport.setEnergyCost(totalEnergyCost);
        monthlyReport.setSensorMaintenanceCost(totalMaintenanceCost);
        monthlyReport.setLaborCost(totalLaborCost);
        monthlyReport.setFertilizerCost(totalFertilizerCost);
        monthlyReport.setOtherCosts(totalOtherCosts);
        monthlyReport.setTotalCost(totalCost);
        monthlyReport.setEstimatedRevenue(totalRevenue);
        monthlyReport.setProfit(totalProfit);
        monthlyReport.setProfitMargin(avgProfitMargin);
        monthlyReport.setTimeframe("monthly");

        return monthlyReport;
    }

    /**
     * Obtenir les données financières mensuelles pour l'affichage des graphiques
     */
    @Override
    public List<MonthlyFinancial> getMonthlyFinancialData(int year) {
        List<MonthlyFinancial> result = new ArrayList<>();

        // Pour chaque mois de l'année
        for (int month = 1; month <= 12; month++) {
            YearMonth yearMonth = YearMonth.of(year, month);
            ProfitabilityReport monthlyReport = generateMonthlyReport(yearMonth);

            // Si des données existent pour ce mois
            if (monthlyReport != null) {
                MonthlyFinancial monthlyFinancial = new MonthlyFinancial();
                monthlyFinancial.setName(yearMonth.getMonth().toString().substring(0, 3)); // Abréviation du mois
                monthlyFinancial.setRevenue(monthlyReport.getEstimatedRevenue());
                monthlyFinancial.setCost(monthlyReport.getTotalCost());
                monthlyFinancial.setProfit(monthlyReport.getProfit());
                result.add(monthlyFinancial);
            } else {
                // Pas de données pour ce mois, créer des données fictives pour l'exemple
                // Dans un environnement de production, vous pourriez vouloir sauter ce mois
                MonthlyFinancial monthlyFinancial = new MonthlyFinancial();
                monthlyFinancial.setName(Month.of(month).toString().substring(0, 3));
                monthlyFinancial.setRevenue(Math.random() * 5000 + 3000); // Exemple de revenus fictifs
                monthlyFinancial.setCost(Math.random() * 4000 + 2000);    // Exemple de coûts fictifs
                monthlyFinancial.setProfit(monthlyFinancial.getRevenue() - monthlyFinancial.getCost());
                result.add(monthlyFinancial);
            }
        }

        return result;
    }

    /**
     * Obtenir les données de répartition des coûts pour l'affichage en graphique
     */
    @Override
    public List<ResourceUsage> getResourceUsageData(LocalDate startDate, LocalDate endDate) {
        List<ProfitabilityReport> reports = getReportsByDateRange(startDate, endDate);

        if (reports.isEmpty()) {
            // Données fictives pour l'exemple
            List<ResourceUsage> dummyData = new ArrayList<>();
            dummyData.add(new ResourceUsage("Eau", 2500, "#3b82f6"));
            dummyData.add(new ResourceUsage("Électricité", 1800, "#eab308"));
            dummyData.add(new ResourceUsage("Main d'œuvre", 3000, "#ef4444"));
            dummyData.add(new ResourceUsage("Engrais", 1200, "#22c55e"));
            dummyData.add(new ResourceUsage("Autres", 800, "#a855f7"));
            return dummyData;
        }

        // Agréger les coûts par catégorie
        double totalWaterCost = reports.stream().mapToDouble(ProfitabilityReport::getWaterCost).sum();
        double totalEnergyCost = reports.stream().mapToDouble(ProfitabilityReport::getEnergyCost).sum();
        double totalLaborCost = reports.stream().mapToDouble(r -> r.getLaborCost() != null ? r.getLaborCost() : 0).sum();
        double totalFertilizerCost = reports.stream().mapToDouble(r -> r.getFertilizerCost() != null ? r.getFertilizerCost() : 0).sum();
        double totalOtherCosts = reports.stream().mapToDouble(r ->
                (r.getOtherCosts() != null ? r.getOtherCosts() : 0) +
                        (r.getSensorMaintenanceCost() != null ? r.getSensorMaintenanceCost() : 0)).sum();

        // Créer les DTOs pour le frontend
        List<ResourceUsage> result = new ArrayList<>();
        result.add(new ResourceUsage("Eau", totalWaterCost, "#3b82f6"));
        result.add(new ResourceUsage("Électricité", totalEnergyCost, "#eab308"));
        result.add(new ResourceUsage("Main d'œuvre", totalLaborCost, "#ef4444"));
        result.add(new ResourceUsage("Engrais", totalFertilizerCost, "#22c55e"));
        result.add(new ResourceUsage("Autres", totalOtherCosts, "#a855f7"));

        return result;
    }

    /**
     * Obtenir les données de rentabilité par culture
     */
    @Override
    public List<CropProfitability> getCropProfitabilityData(LocalDate startDate, LocalDate endDate) {
        // Dans un système réel, vous feriez une requête pour regrouper les données par type de culture
        // Ici, nous allons créer des données simulées similaires à celles utilisées dans le frontend

        List<CropProfitability> result = new ArrayList<>();

        // Vous pourriez remplacer ceci par une requête réelle pour regrouper par type de culture
        Map<CropType, List<ProfitabilityReport>> reportsByCrop = getReportsByDateRange(startDate, endDate)
                .stream()
                .filter(r -> r.getCropType() != null)
                .collect(Collectors.groupingBy(ProfitabilityReport::getCropType));

        // Si nous avons des données réelles
        if (!reportsByCrop.isEmpty()) {
            for (Map.Entry<CropType, List<ProfitabilityReport>> entry : reportsByCrop.entrySet()) {
                CropType cropType = entry.getKey();
                List<ProfitabilityReport> cropReports = entry.getValue();

                double totalRevenue = cropReports.stream().mapToDouble(ProfitabilityReport::getEstimatedRevenue).sum();
                double totalCost = cropReports.stream().mapToDouble(ProfitabilityReport::getTotalCost).sum();
                double totalProfit = totalRevenue - totalCost;

                CropProfitability cropProfitability = new CropProfitability();
                cropProfitability.setName(cropType.name().substring(0, 1).toUpperCase() + cropType.name().substring(1).toLowerCase());
                cropProfitability.setRevenue(totalRevenue);
                cropProfitability.setCost(totalCost);
                cropProfitability.setProfit(totalProfit);

                result.add(cropProfitability);
            }
        } else {
            // Données fictives similaires à celles du frontend
            result.add(new CropProfitability("Tomates", 5200, 3100, 2100));
            result.add(new CropProfitability("Laitue", 3800, 2200, 1600));
            result.add(new CropProfitability("Concombres", 4500, 2800, 1700));
            result.add(new CropProfitability("Poivrons", 6200, 4100, 2100));
        }

        return result;
    }

    /**
     * Obtenir les données d'efficacité d'eau par zone
     */
    @Override
    public List<WaterEfficiency> getWaterEfficiencyData() {
        // Dans un système réel, vous calculeriez cela à partir des données des capteurs
        // Pour l'instant, nous retournons des données fictives similaires à celles du frontend

        List<WaterEfficiency> result = new ArrayList<>();
        result.add(new WaterEfficiency("TOMATOES", 0.85, 1200));
        result.add(new WaterEfficiency("RICE", 0.72, 1800));
        result.add(new WaterEfficiency("POTATOES", 0.91, 950));
        result.add(new WaterEfficiency("SOYA", 0.78, 1500));

        return result;
    }

    /**
     * Obtenir les statistiques de base pour les KPIs
     */
    @Override
    public Map<String, Object> getDashboardKPIs(LocalDate startDate, LocalDate endDate) {
        List<ProfitabilityReport> reports = getReportsByDateRange(startDate, endDate);

        double totalRevenue = reports.stream().mapToDouble(ProfitabilityReport::getEstimatedRevenue).sum();
        double totalCost = reports.stream().mapToDouble(ProfitabilityReport::getTotalCost).sum();
        double totalProfit = totalRevenue - totalCost;
        double profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

        // Calculer les variations par rapport à la période précédente
        LocalDate prevStartDate = startDate.minusDays(endDate.toEpochDay() - startDate.toEpochDay() + 1);
        LocalDate prevEndDate = startDate.minusDays(1);
        List<ProfitabilityReport> prevReports = getReportsByDateRange(prevStartDate, prevEndDate);

        double prevTotalRevenue = prevReports.stream().mapToDouble(ProfitabilityReport::getEstimatedRevenue).sum();
        double prevTotalCost = prevReports.stream().mapToDouble(ProfitabilityReport::getTotalCost).sum();
        double prevTotalProfit = prevTotalRevenue - prevTotalCost;
        double prevProfitMargin = prevTotalRevenue > 0 ? (prevTotalProfit / prevTotalRevenue) * 100 : 0;

        double revenueChange = prevTotalRevenue > 0 ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100 : 0;
        double costChange = prevTotalCost > 0 ? ((totalCost - prevTotalCost) / prevTotalCost) * 100 : 0;
        double profitChange = prevTotalProfit > 0 ? ((totalProfit - prevTotalProfit) / prevTotalProfit) * 100 : 0;
        double marginChange = prevProfitMargin > 0 ? (profitMargin - prevProfitMargin) : 0;

        Map<String, Object> result = new HashMap<>();
        result.put("totalRevenue", totalRevenue);
        result.put("totalCost", totalCost);
        result.put("totalProfit", totalProfit);
        result.put("profitMargin", profitMargin);
        result.put("revenueChange", revenueChange);
        result.put("costChange", costChange);
        result.put("profitChange", profitChange);
        result.put("marginChange", marginChange);

        // Ajouter les statistiques d'utilisation des ressources
        double waterUsage = reports.stream().mapToDouble(r ->
                resourceConsumptionService.getWaterConsumption(r.getDate())).sum();
        double energyUsage = reports.stream().mapToDouble(r ->
                resourceConsumptionService.getEnergyConsumption(r.getDate())).sum();

        result.put("waterUsage", waterUsage);
        result.put("energyUsage", energyUsage);

        return result;
    }
}