package com.smartfarm.backendms1.service.facade;

import java.time.LocalDate;

public interface ResourceConsumptionService {

    /**
     * Obtenir la consommation d'eau estimée pour une journée spécifique
     * @param date Date du jour pour lequel calculer la consommation
     * @return Consommation d'eau estimée en litres
     */
    double getWaterConsumption(LocalDate date);

    /**
     * Obtenir la consommation d'énergie estimée pour une journée spécifique
     * @param date Date du jour pour lequel calculer la consommation
     * @return Consommation d'énergie en kWh
     */
    double getEnergyConsumption(LocalDate date);

    /**
     * Obtenir l'humidité moyenne pour une journée
     * @param date Date du jour
     * @return Humidité moyenne en pourcentage
     */
    double getAverageHumidity(LocalDate date);

    /**
     * Obtenir la température moyenne pour une journée
     * @param date Date du jour
     * @return Température moyenne en degrés Celsius
     */
    double getAverageTemperature(LocalDate date);

    /**
     * Vérifier s'il a plu pour une journée donnée
     * @param date Date du jour
     * @return true s'il a plu, false sinon
     */
    boolean hasRained(LocalDate date);

    /**
     * Vérifier s'il y a eu un incendie pour une journée donnée
     * @param date Date du jour
     * @return true s'il y a eu un incendie, false sinon
     */
    boolean hasFire(LocalDate date);

    /**
     * Calculer les économies d'eau réalisées grâce à l'irrigation intelligente
     * @param date Date du jour
     * @return Économies d'eau estimées en litres
     */
    double calculateWaterSavings(LocalDate date);
}