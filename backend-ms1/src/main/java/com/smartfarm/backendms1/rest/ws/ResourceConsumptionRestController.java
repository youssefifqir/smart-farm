package com.smartfarm.backendms1.rest.ws;

import com.smartfarm.backendms1.rest.converter.ProfitabilityReportConverter;
import com.smartfarm.backendms1.service.facade.ResourceConsumptionService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/api/v1/resource-consumption")
public class ResourceConsumptionRestController {


    private final ResourceConsumptionService resourceConsumptionService;
    private final ProfitabilityReportConverter profitabilityReportConverter;

    public ResourceConsumptionRestController(ResourceConsumptionService resourceConsumptionService, ProfitabilityReportConverter profitabilityReportConverter) {
        this.resourceConsumptionService = resourceConsumptionService;
        this.profitabilityReportConverter = profitabilityReportConverter;
    }
    /**
     * Obtenir la consommation d'eau pour une date spécifique
     * @param date Date pour laquelle calculer la consommation
     * @return Consommation d'eau en litres
     */
    @GetMapping("/water")
    public ResponseEntity<Double> getWaterConsumption(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        double waterConsumption = resourceConsumptionService.getWaterConsumption(date);
        return new ResponseEntity<>(waterConsumption, HttpStatus.OK);
    }

    /**
     * Obtenir la consommation d'énergie pour une date spécifique
     * @param date Date pour laquelle calculer la consommation
     * @return Consommation d'énergie en kWh
     */
    @GetMapping("/energy")
    public ResponseEntity<Double> getEnergyConsumption(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        double energyConsumption = resourceConsumptionService.getEnergyConsumption(date);
        return new ResponseEntity<>(energyConsumption, HttpStatus.OK);
    }

    /**
     * Obtenir l'humidité moyenne pour une date spécifique
     * @param date Date pour laquelle calculer l'humidité moyenne
     * @return Humidité moyenne en pourcentage
     */
    @GetMapping("/humidity")
    public ResponseEntity<Double> getAverageHumidity(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        double avgHumidity = resourceConsumptionService.getAverageHumidity(date);
        return new ResponseEntity<>(avgHumidity, HttpStatus.OK);
    }

    /**
     * Obtenir la température moyenne pour une date spécifique
     * @param date Date pour laquelle calculer la température moyenne
     * @return Température moyenne en degrés Celsius
     */
    @GetMapping("/temperature")
    public ResponseEntity<Double> getAverageTemperature(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        double avgTemperature = resourceConsumptionService.getAverageTemperature(date);
        return new ResponseEntity<>(avgTemperature, HttpStatus.OK);
    }

    /**
     * Vérifier s'il a plu pour une date spécifique
     * @param date Date à vérifier
     * @return Boolean indiquant s'il a plu
     */
    @GetMapping("/rain-status")
    public ResponseEntity<Boolean> hasRained(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        boolean hasRained = resourceConsumptionService.hasRained(date);
        return new ResponseEntity<>(hasRained, HttpStatus.OK);
    }

    /**
     * Vérifier s'il y a eu un incendie pour une date spécifique
     * @param date Date à vérifier
     * @return Boolean indiquant s'il y a eu un incendie
     */
    @GetMapping("/fire-status")
    public ResponseEntity<Boolean> hasFire(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        boolean hasFire = resourceConsumptionService.hasFire(date);
        return new ResponseEntity<>(hasFire, HttpStatus.OK);
    }

    /**
     * Calculer les économies d'eau réalisées pour une date spécifique
     * @param date Date pour laquelle calculer les économies
     * @return Économies d'eau en litres
     */
    @GetMapping("/water-savings")
    public ResponseEntity<Double> calculateWaterSavings(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        double waterSavings = resourceConsumptionService.calculateWaterSavings(date);
        return new ResponseEntity<>(waterSavings, HttpStatus.OK);
    }

    /**
     * Obtenir toutes les données de consommation pour une date spécifique
     * @param date Date pour laquelle obtenir les données
     * @return Map contenant toutes les données de consommation
     */
    @GetMapping("/daily-summary")
    public ResponseEntity<Map<String, Object>> getDailySummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Map<String, Object> summary = new HashMap<>();

        // Récupérer toutes les données
        double waterConsumption = resourceConsumptionService.getWaterConsumption(date);
        double energyConsumption = resourceConsumptionService.getEnergyConsumption(date);
        double avgHumidity = resourceConsumptionService.getAverageHumidity(date);
        double avgTemperature = resourceConsumptionService.getAverageTemperature(date);
        boolean hasRained = resourceConsumptionService.hasRained(date);
        boolean hasFire = resourceConsumptionService.hasFire(date);
        double waterSavings = resourceConsumptionService.calculateWaterSavings(date);

        // Construire le résumé
        summary.put("date", date);
        summary.put("waterConsumption", waterConsumption);
        summary.put("energyConsumption", energyConsumption);
        summary.put("averageHumidity", avgHumidity);
        summary.put("averageTemperature", avgTemperature);
        summary.put("hasRained", hasRained);
        summary.put("hasFire", hasFire);
        summary.put("waterSavings", waterSavings);

        return new ResponseEntity<>(summary, HttpStatus.OK);
    }
}