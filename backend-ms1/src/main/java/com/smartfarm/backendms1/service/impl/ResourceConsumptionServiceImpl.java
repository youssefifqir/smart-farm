package com.smartfarm.backendms1.service.impl;

import com.smartfarm.backendms1.bean.SensorData;
import com.smartfarm.backendms1.dao.SensorRepository;
import com.smartfarm.backendms1.service.facade.ResourceConsumptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class ResourceConsumptionServiceImpl implements ResourceConsumptionService {

    @Autowired
    private SensorRepository sensorRepository;

    // Constantes pour les estimations
    private static final double PUMP_POWER_KW = 0.75; // Puissance de la pompe en kW
    private static final double DAILY_BASE_WATER_CONSUMPTION = 1000.0; // Litres par jour sans optimisation
    private static final double PUMP_RUN_TIME_HOURS = 6.0; // Temps de fonctionnement moyen de la pompe par jour

    /**
     * Obtenir la consommation d'eau estimée pour une journée spécifique
     * @param date Date du jour pour lequel calculer la consommation
     * @return Consommation d'eau estimée en litres
     */
    @Override
    public double getWaterConsumption(LocalDate date) {
        // Définir la plage de temps pour la journée
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        // Récupérer les données du capteur pour cette journée
        List<SensorData> sensorDataList = sensorRepository.findByTimestampBetween(startOfDay, endOfDay);

        if (sensorDataList.isEmpty()) {
            return 0.0; // Aucune donnée disponible
        }

        // Somme des volumes d'eau consommés (en litres par exemple)
        return sensorDataList.stream()
                .mapToDouble(data -> data.getWaterConsumption() != null ? data.getWaterConsumption() : 0.0)
                .sum();
    }

    /**
     * Obtenir la consommation d'énergie estimée pour une journée spécifique
     * @param date Date du jour pour lequel calculer la consommation
     * @return Consommation d'énergie en kWh
     */
    @Override
    public double getEnergyConsumption(LocalDate date) {
        // Définir la plage de temps pour la journée
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        // Récupérer les données du capteur pour cette journée
        List<SensorData> sensorDataList = sensorRepository.findByTimestampBetween(startOfDay, endOfDay);

        if (sensorDataList.isEmpty()) {
            return 0.0;
        }

        // Total de l'eau pompée dans la journée (litres)
        double totalWaterConsumed = sensorDataList.stream()
                .mapToDouble(data -> data.getWaterConsumption() != null ? data.getWaterConsumption() : 0.0)
                .sum();

        // Hypothèse : 1 kWh pour pomper 1000 litres d’eau (ajustable selon la pompe)
        double energyPerLiter = 1.0 / 1000.0; // kWh par litre

        return totalWaterConsumed * energyPerLiter;
    }

    /**
     * Obtenir l'humidité moyenne pour une journée
     * @param date Date du jour
     * @return Humidité moyenne en pourcentage
     */
    @Override
    public double getAverageHumidity(LocalDate date) {
        // Définir la plage de temps pour la journée
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        Double avgHum = sensorRepository.findAverageHumidityBetween(startOfDay, endOfDay);
        return avgHum != null ? avgHum : 20.0;

    }

    /**
     * Obtenir la température moyenne pour une journée
     * @param date Date du jour
     * @return Température moyenne en degrés Celsius
     */
    @Override
    public double getAverageTemperature(LocalDate date) {
        // Définir la plage de temps pour la journée
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        Double avgTemp = sensorRepository.findAverageTemperatureBetween(startOfDay, endOfDay);

        // Retourner la moyenne ou une valeur par défaut si null
        return avgTemp != null ? avgTemp : 20.0;
    }

    /**
     * Vérifier s'il a plu pour une journée donnée
     * @param date Date du jour
     * @return true s'il a plu, false sinon
     */
    @Override
    public boolean hasRained(LocalDate date) {
        // Définir la plage de temps pour la journée
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        // Récupérer les données du capteur pour cette journée
        List<SensorData> sensorDataList = sensorRepository.findByTimestampBetween(startOfDay, endOfDay);

        // Vérifier si au moins une lecture indique qu'il a plu
        return sensorDataList.stream().anyMatch(SensorData::getIsRaining);
    }

    /**
     * Vérifier s'il y a eu un incendie pour une journée donnée
     * @param date Date du jour
     * @return true s'il y a eu un incendie, false sinon
     */
    @Override
    public boolean hasFire(LocalDate date) {
        // Définir la plage de temps pour la journée
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        // Récupérer les données du capteur pour cette journée
        List<SensorData> sensorDataList = sensorRepository.findByTimestampBetween(startOfDay, endOfDay);

        // Vérifier si au moins une lecture indique qu'il y a eu un incendie
        return sensorDataList.stream().anyMatch(SensorData::getIsFire);
    }

    /**
     * Calculer les économies d'eau réalisées grâce à l'irrigation intelligente
     * @param date Date du jour
     * @return Économies d'eau estimées en litres
     */
    @Override
    public double calculateWaterSavings(LocalDate date) {
        // Consommation d'eau estimée avec le système IoT
        double smartConsumption = getWaterConsumption(date);

        // Consommation d'eau estimée sans système intelligent
        double traditionalConsumption = DAILY_BASE_WATER_CONSUMPTION;

        // Si il a plu, un système traditionnel aurait quand même arrosé
        if (hasRained(date)) {
            traditionalConsumption *= 1.0; // Pas de réduction
        }

        // Calculer les économies
        return traditionalConsumption - smartConsumption;
    }
}