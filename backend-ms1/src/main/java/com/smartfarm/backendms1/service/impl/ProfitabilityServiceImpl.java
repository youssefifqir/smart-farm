package com.smartfarm.backendms1.service.impl;

import com.smartfarm.backendms1.bean.*;
import com.smartfarm.backendms1.dao.*;

import com.smartfarm.backendms1.service.facade.ProfitabilityService;
import com.smartfarm.backendms1.service.facade.ResourceConsumptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    @Autowired
    private AchatRepository achatRepository;

    @Autowired
    private VenteRepository venteRepository;

    @Autowired
    private EmployeRepository employeRepository;

    @Autowired
    private ProductRepository productRepository;

    // Constantes pour les calculs financiers (à ajuster selon vos besoins)
    private static final double WATER_PRICE_PER_LITER = 0.002; // Prix de l'eau par litre
    private static final double ELECTRICITY_PRICE_PER_KWH = 0.15; // Prix de l'électricité par kWh
    private static final double MONTHLY_MAINTENANCE_COST = 50.0; // Coût mensuel d'entretien des capteurs
    @Autowired
    private SensorRepository sensorRepository;

    /**
     * Générer un rapport de rentabilité quotidien basé sur les vraies données
     */
    @Override
    public ProfitabilityReport generateDailyReport(LocalDate date) {
        // Récupérer les données de consommation d'eau et d'énergie
        double waterUsage = resourceConsumptionService.getWaterConsumption(date); // en litres
        double energyUsage = resourceConsumptionService.getEnergyConsumption(date); // en kWh

        // Calculer les coûts fixes
        double waterCost = waterUsage * WATER_PRICE_PER_LITER;
        double energyCost = energyUsage * ELECTRICITY_PRICE_PER_KWH;
        double dailyMaintenanceCost = MONTHLY_MAINTENANCE_COST / 30.0;

        // Calculer les coûts réels à partir des données
        double laborCost = calculateDailyLaborCost(date);
        double purchaseCost = calculateDailyPurchaseCost(date);
        double otherCosts = dailyMaintenanceCost; // Coûts d'entretien

        double totalCost = waterCost + energyCost + laborCost + purchaseCost + otherCosts;

        // Calculer les revenus réels
        double actualRevenue = calculateDailyRevenue(date);

        // Calculer le profit
        double profit = actualRevenue - totalCost;

        // Calculer la marge bénéficiaire
        double profitMargin = actualRevenue > 0 ? (profit / actualRevenue) * 100 : 0;

        // Créer et sauvegarder le rapport
        ProfitabilityReport report = new ProfitabilityReport();
        report.setDate(date);
        report.setWaterCost(waterCost);
        report.setEnergyCost(energyCost);
        report.setSensorMaintenanceCost(dailyMaintenanceCost);
        report.setLaborCost(laborCost);
        report.setFertilizerCost(purchaseCost); // Utiliser purchaseCost pour les achats
        report.setOtherCosts(otherCosts);
        report.setTotalCost(totalCost);
        report.setEstimatedRevenue(actualRevenue);
        report.setProfit(profit);
        report.setProfitMargin(profitMargin);
        report.setTimeframe("daily");

        // Par défaut, attribuer à une zone et un type de culture
        report.setZone(Zone.Zone_A);
        //report.setCropType(CropType.TOMATOES);
        report.setYieldAmount(calculateDailyYield(date)); // Production réelle

        return profitabilityReportRepository.save(report);
    }

    /**
     * Calculer le coût journalier de main-d'œuvre
     */
    @Override
    public double calculateDailyLaborCost(LocalDate date) {
        // Récupérer tous les employés
        List<Employe> employes = employeRepository.findAll();

        // Calculer le coût journalier total (salaire mensuel / 30 jours)
        double totalDailyLaborCost = employes.stream()
                .mapToDouble(employe -> employe.getSalaire().doubleValue() / 30.0)
                .sum();

        return totalDailyLaborCost;
    }

    /**
     * Calculer le coût journalier des achats (engrais, matériel, etc.)
     */
    private double calculateDailyPurchaseCost(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        // Récupérer tous les achats du jour
        List<Achat> achatsOfDay = achatRepository.findByDateAchatBetween(startOfDay, endOfDay);

        // Calculer le coût total des achats
        return achatsOfDay.stream()
                .mapToDouble(achat -> achat.getPrixTotal().doubleValue())
                .sum();
    }

    /**
     * Calculer le revenu journalier réel basé sur les ventes
     */
    private double calculateDailyRevenue(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        // Récupérer toutes les ventes du jour
        List<Vente> ventesOfDay = venteRepository.findByDateVenteBetween(startOfDay, endOfDay);

        // Calculer le revenu total des ventes
        return ventesOfDay.stream()
                .mapToDouble(vente -> vente.getPrixTotal().doubleValue())
                .sum();
    }

    /**
     * Calculer le rendement journalier réel basé sur les ventes
     */
    private double calculateDailyYield(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        // Récupérer toutes les ventes du jour
        List<Vente> ventesOfDay = venteRepository.findByDateVenteBetween(startOfDay, endOfDay);

        // Calculer la quantité totale vendue (en kg ou unités)
        return ventesOfDay.stream()
                .mapToDouble(Vente::getQuantite)
                .sum();
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
        return totalProfit > 0 ? (totalProfit / systemCost) * 100 : 0; // en pourcentage
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
        double totalPurchaseCost = dailyReports.stream().mapToDouble(r -> r.getFertilizerCost() != null ? r.getFertilizerCost() : 0).sum();
        double totalOtherCosts = dailyReports.stream().mapToDouble(r -> r.getOtherCosts() != null ? r.getOtherCosts() : 0).sum();
        double totalCost = totalWaterCost + totalEnergyCost + totalMaintenanceCost + totalLaborCost + totalPurchaseCost + totalOtherCosts;
        double totalRevenue = dailyReports.stream().mapToDouble(ProfitabilityReport::getEstimatedRevenue).sum();
        double totalProfit = totalRevenue - totalCost;
        double avgProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

        // Créer le rapport mensuel
        ProfitabilityReport monthlyReport = new ProfitabilityReport();
        monthlyReport.setDate(startDate); // Premier jour du mois
        monthlyReport.setWaterCost(totalWaterCost);
        monthlyReport.setEnergyCost(totalEnergyCost);
        monthlyReport.setSensorMaintenanceCost(totalMaintenanceCost);
        monthlyReport.setLaborCost(totalLaborCost);
        monthlyReport.setFertilizerCost(totalPurchaseCost);
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
                // Pas de données pour ce mois, on met des valeurs nulles ou on skip
                MonthlyFinancial monthlyFinancial = new MonthlyFinancial();
                monthlyFinancial.setName(Month.of(month).toString().substring(0, 3));
                monthlyFinancial.setRevenue(0.0);
                monthlyFinancial.setCost(0.0);
                monthlyFinancial.setProfit(0.0);
                result.add(monthlyFinancial);
            }
        }

        return result;
    }

    /**
     * Obtenir les données de répartition des coûts basées sur les vraies données
     */
    @Override
    public List<ResourceUsage> getResourceUsageData(LocalDate startDate, LocalDate endDate) {
        List<ProfitabilityReport> reports = getReportsByDateRange(startDate, endDate);

        if (reports.isEmpty()) {
            // Retourner des données vides au lieu de données fictives
            return new ArrayList<>();
        }

        // Agréger les coûts par catégorie
        double totalWaterCost = reports.stream().mapToDouble(ProfitabilityReport::getWaterCost).sum();
        double totalEnergyCost = reports.stream().mapToDouble(ProfitabilityReport::getEnergyCost).sum();
        double totalLaborCost = reports.stream().mapToDouble(r -> r.getLaborCost() != null ? r.getLaborCost() : 0).sum();
        double totalPurchaseCost = reports.stream().mapToDouble(r -> r.getFertilizerCost() != null ? r.getFertilizerCost() : 0).sum();
        double totalOtherCosts = reports.stream().mapToDouble(r ->
                (r.getOtherCosts() != null ? r.getOtherCosts() : 0) +
                        (r.getSensorMaintenanceCost() != null ? r.getSensorMaintenanceCost() : 0)).sum();

        // Créer les DTOs pour le frontend
        List<ResourceUsage> result = new ArrayList<>();
        result.add(new ResourceUsage("Eau", totalWaterCost, "#3b82f6"));
        result.add(new ResourceUsage("Électricité", totalEnergyCost, "#eab308"));
        result.add(new ResourceUsage("Main d'œuvre", totalLaborCost, "#ef4444"));
        result.add(new ResourceUsage("Achats/Matériel", totalPurchaseCost, "#22c55e"));
        result.add(new ResourceUsage("Autres", totalOtherCosts, "#a855f7"));

        return result;
    }

    /**
     * Obtenir les données de rentabilité par culture basées sur les ventes réelles
     */
    @Override
    public List<CropProfitability> getCropProfitabilityData(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        // Récupérer toutes les ventes de la période
        List<Vente> ventes = venteRepository.findByDateVenteBetween(startDateTime, endDateTime);

        // Récupérer TOUS les achats antérieurs à la fin de période
        // (car les produits vendus peuvent avoir été achetés avant la période de vente)
        List<Achat> achats = achatRepository.findByDateAchatBefore(endDateTime);

        // Grouper les ventes par produit
        Map<Product, List<Vente>> ventesByProduct = ventes.stream()
                .collect(Collectors.groupingBy(Vente::getProduit));

        // Grouper les achats par produit
        Map<Product, List<Achat>> achatsByProduct = achats.stream()
                .collect(Collectors.groupingBy(Achat::getProduit));

        List<CropProfitability> result = new ArrayList<>();

        // Pour chaque produit vendu, calculer la rentabilité
        for (Map.Entry<Product, List<Vente>> entry : ventesByProduct.entrySet()) {
            Product product = entry.getKey();
            List<Vente> productVentes = entry.getValue();

            // Calculer le revenu total pour ce produit
            double totalRevenue = productVentes.stream()
                    .mapToDouble(vente -> vente.getPrixTotal().doubleValue())
                    .sum();

            // Calculer les quantités vendues pour la période
            int quantiteVendue = productVentes.stream()
                    .mapToInt(Vente::getQuantite)
                    .sum();

            // Calculer le coût basé sur le prix d'achat moyen et les quantités vendues
            double totalCost = 0.0;
            if (achatsByProduct.containsKey(product)) {
                List<Achat> productAchats = achatsByProduct.get(product);

                // Calculer le coût unitaire moyen pondéré
                double coutUnitaireMoyen = calculateAverageUnitCost(productAchats);
                totalCost = coutUnitaireMoyen * quantiteVendue;
            } else {
                // Si aucun achat trouvé, estimer le coût à 70% du prix de vente
                totalCost = product.getPrix().doubleValue() * quantiteVendue * 0.7;
            }

            double totalProfit = totalRevenue - totalCost;

            CropProfitability cropProfitability = new CropProfitability();
            cropProfitability.setName(product.getNom());
            cropProfitability.setRevenue(totalRevenue);
            cropProfitability.setCost(totalCost);
            cropProfitability.setProfit(totalProfit);

            result.add(cropProfitability);
        }

        return result;
    }

    /**
     * Méthode helper pour calculer le coût unitaire moyen pondéré
     */
    private double calculateAverageUnitCost(List<Achat> achats) {
        if (achats == null || achats.isEmpty()) {
            return 0.0;
        }

        double totalCost = achats.stream()
                .mapToDouble(achat -> achat.getPrixTotal().doubleValue())
                .sum();

        int totalQuantity = achats.stream()
                .mapToInt(Achat::getQuantite)
                .sum();

        return totalQuantity > 0 ? totalCost / totalQuantity : 0.0;
    }
    /**

    @Override
    public List<CropProfitability> getCropProfitabilityData(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        // Récupérer toutes les ventes de la période
        List<Vente> ventes = venteRepository.findByDateVenteBetween(startDateTime, endDateTime);
        List<Achat> achats = achatRepository.findByDateAchatBetween(startDateTime, endDateTime);

        // Grouper les ventes par produit
        Map<Product, List<Vente>> ventesByProduct = ventes.stream()
                .collect(Collectors.groupingBy(Vente::getProduit));

        // Grouper les achats par produit
        Map<Product, List<Achat>> achatsByProduct = achats.stream()
                .collect(Collectors.groupingBy(Achat::getProduit));

        List<CropProfitability> result = new ArrayList<>();

        // Pour chaque produit vendu, calculer la rentabilité
        for (Map.Entry<Product, List<Vente>> entry : ventesByProduct.entrySet()) {
            Product product = entry.getKey();
            List<Vente> productVentes = entry.getValue();

            // Calculer le revenu total pour ce produit
            double totalRevenue = productVentes.stream()
                    .mapToDouble(vente -> vente.getPrixTotal().doubleValue())
                    .sum();

            // Calculer le coût total pour ce produit (achats)
            double totalCost = 0.0;
            if (achatsByProduct.containsKey(product)) {
                totalCost = achatsByProduct.get(product).stream()
                        .mapToDouble(achat -> achat.getPrixTotal().doubleValue())
                        .sum();
            }

            double totalProfit = totalRevenue - totalCost;

            CropProfitability cropProfitability = new CropProfitability();
            cropProfitability.setName(product.getNom());
            cropProfitability.setRevenue(totalRevenue);
            cropProfitability.setCost(totalCost);
            cropProfitability.setProfit(totalProfit);

            result.add(cropProfitability);
        }

        return result;
    } */

    /**
     * Obtenir les données d'efficacité d'eau par zone (garder la logique existante pour l'instant)

    @Override
    public List<WaterEfficiency> getWaterEfficiencyData() {
        // Cette méthode nécessiterait des données plus complexes sur les zones et l'utilisation d'eau
        // Pour l'instant, on garde la logique existante
        List<WaterEfficiency> result = new ArrayList<>();
        result.add(new WaterEfficiency("TOMATOES", 0.85, 1200));
        result.add(new WaterEfficiency("RICE", 0.72, 1800));
        result.add(new WaterEfficiency("POTATOES", 0.91, 950));
        result.add(new WaterEfficiency("SOYA", 0.78, 1500));

        return result;
    }
*/
    @Override
    @Scheduled(cron = "0 * * * * *") // chaque jour à minuit
    public List<WaterEfficiency> getWaterEfficiencyData() {
        Zone zoneCapteur = Zone.Zone_A; // la seule zone mesurée actuellement
        LocalDate today = LocalDate.now();

        double waterConsumed = resourceConsumptionService.getWaterConsumption(today);

        List<Product> produitsZone = productRepository.findByCategory_Zone(zoneCapteur);

        double totalVentes = produitsZone.stream()
                .mapToDouble(p -> p.getPrix().doubleValue() * p.getQuantite())
                .sum();

        double efficacite = waterConsumed > 0 ? totalVentes / waterConsumed : 0;

        WaterEfficiency efficiency = new WaterEfficiency(
                zoneCapteur.name(),
                efficacite,
                waterConsumed
        );

        return List.of(efficiency);
    }

    /**
     * Obtenir les statistiques de base pour les KPIs basées sur les vraies données
     */
    @Override
    public Map<String, Object> getDashboardKPIs(LocalDate startDate, LocalDate endDate) {
        List<ProfitabilityReport> reports = getReportsByDateRange(startDate, endDate);

        double totalRevenue = reports.stream().mapToDouble(ProfitabilityReport::getEstimatedRevenue).sum();
        double totalCost = reports.stream().mapToDouble(ProfitabilityReport::getTotalCost).sum();
        double totalProfit = totalRevenue - totalCost;
        double profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

        // Calculer les variations par rapport à la période précédente
        long periodDays = endDate.toEpochDay() - startDate.toEpochDay() + 1;
        LocalDate prevStartDate = startDate.minusDays(periodDays);
        LocalDate prevEndDate = startDate.minusDays(1);
        List<ProfitabilityReport> prevReports = getReportsByDateRange(prevStartDate, prevEndDate);

        double prevTotalRevenue = prevReports.stream().mapToDouble(ProfitabilityReport::getEstimatedRevenue).sum();
        double prevTotalCost = prevReports.stream().mapToDouble(ProfitabilityReport::getTotalCost).sum();
        double prevTotalProfit = prevTotalRevenue - prevTotalCost;
        double prevProfitMargin = prevTotalRevenue > 0 ? (prevTotalProfit / prevTotalRevenue) * 100 : 0;

        double revenueChange = prevTotalRevenue > 0 ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100 : 0;
        double costChange = prevTotalCost > 0 ? ((totalCost - prevTotalCost) / prevTotalCost) * 100 : 0;
        double profitChange = prevTotalProfit != 0 ? ((totalProfit - prevTotalProfit) / Math.abs(prevTotalProfit)) * 100 : 0;
        double marginChange = profitMargin - prevProfitMargin;

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

    /**
     * Obtenir les données financières hebdomadaires pour l'affichage des graphiques
     */
    @Override
    public List<WeeklyFinancial> getWeeklyFinancialData() {
        String[] joursDelaSemaine = {"Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"};

        LocalDate now = LocalDate.now();
        int jourActuel = now.getDayOfWeek().getValue();
        LocalDate debutDeSemaine = now.minusDays(jourActuel - 1);

        List<WeeklyFinancial> result = new ArrayList<>();

        for (int i = 0; i < 7; i++) {
            LocalDate jourCourant = debutDeSemaine.plusDays(i);
            List<ProfitabilityReport> rapportsJournaliers = getReportsByDateRange(jourCourant, jourCourant);

            WeeklyFinancial donneesJour = new WeeklyFinancial();
            donneesJour.setName(joursDelaSemaine[i]);

            if (!rapportsJournaliers.isEmpty()) {
                double totalRevenue = rapportsJournaliers.stream().mapToDouble(ProfitabilityReport::getEstimatedRevenue).sum();
                double totalCost = rapportsJournaliers.stream().mapToDouble(ProfitabilityReport::getTotalCost).sum();
                double totalProfit = totalRevenue - totalCost;

                donneesJour.setRevenue(totalRevenue);
                donneesJour.setCost(totalCost);
                donneesJour.setProfit(totalProfit);
            } else {
                // Pas de données, mettre à zéro
                donneesJour.setRevenue(0.0);
                donneesJour.setCost(0.0);
                donneesJour.setProfit(0.0);
            }

            result.add(donneesJour);
        }

        return result;
    }

    /**
     * Obtenir les données financières annuelles pour l'affichage des graphiques
     */
    @Override
    public List<YearlyFinancial> getYearlyFinancialData() {
        List<YearlyFinancial> result = new ArrayList<>();
        int currentYear = LocalDate.now().getYear();

        for (int year = currentYear - 4; year <= currentYear; year++) {
            LocalDate startOfYear = LocalDate.of(year, 1, 1);
            LocalDate endOfYear = LocalDate.of(year, 12, 31);

            List<ProfitabilityReport> yearlyReports = getReportsByDateRange(startOfYear, endOfYear);

            YearlyFinancial yearData = new YearlyFinancial();
            yearData.setName(String.valueOf(year));

            if (!yearlyReports.isEmpty()) {
                double totalRevenue = yearlyReports.stream().mapToDouble(ProfitabilityReport::getEstimatedRevenue).sum();
                double totalCost = yearlyReports.stream().mapToDouble(ProfitabilityReport::getTotalCost).sum();
                double totalProfit = totalRevenue - totalCost;

                yearData.setRevenue(totalRevenue);
                yearData.setCost(totalCost);
                yearData.setProfit(totalProfit);
            } else {
                // Pas de données pour cette année
                yearData.setRevenue(0.0);
                yearData.setCost(0.0);
                yearData.setProfit(0.0);
            }

            result.add(yearData);
        }

        return result;
    }

    public List<LocalDate> getDistinctDates() {
        List<java.sql.Date> dates = sensorRepository.findDistinctDatesNative();
        return dates.stream()
                .map(java.sql.Date::toLocalDate)
                .collect(Collectors.toList());
    }

    @Scheduled(cron = "0 * * * * *") // Tous les jours à 2h du matin
    public void generateMissingDailyReports() {
        List<LocalDate> datesAvecData = getDistinctDates();  // <-- ici on utilise la méthode avec conversion
        for (LocalDate date : datesAvecData) {
            if (!profitabilityReportRepository.existsByDate(date)) {
                generateDailyReport(date);
            }
        }
    }



}