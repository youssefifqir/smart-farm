package com.smartfarm.backendms1.service.facade;

import com.itextpdf.text.DocumentException;
import java.io.IOException;
import java.time.LocalDate;

/**
 * Service interface pour la génération de rapports PDF de rentabilité
 * @author SmartFarm Team
 */
public interface PdfReportService {

    /**
     * Génère un rapport PDF de rentabilité quotidien pour une date donnée
     *
     * @param date La date pour laquelle générer le rapport
     * @return Le rapport PDF sous forme de tableau d'octets
     * @throws DocumentException Si une erreur survient lors de la création du document PDF
     * @throws IOException Si une erreur d'entrée/sortie survient
     */
    byte[] generateDailyProfitabilityReport(LocalDate date) throws DocumentException, IOException;
    byte[] generateMonthlyProfitabilityReport(int year, int month) throws DocumentException, IOException;

    /**
     * Génère un rapport PDF de rentabilité pour une période donnée
     *
     * @param startDate Date de début de la période
     * @param endDate Date de fin de la période
     * @return Le rapport PDF sous forme de tableau d'octets
     * @throws DocumentException Si une erreur survient lors de la création du document PDF
     * @throws IOException Si une erreur d'entrée/sortie survient
     */
    byte[] generatePeriodProfitabilityReport(LocalDate startDate, LocalDate endDate) throws DocumentException, IOException;

    /**
     * Génère un rapport PDF de comparaison de rentabilité entre deux périodes
     *
     * @param period1Start Date de début de la première période
     * @param period1End Date de fin de la première période
     * @param period2Start Date de début de la deuxième période
     * @param period2End Date de fin de la deuxième période
     * @return Le rapport PDF sous forme de tableau d'octets
     * @throws DocumentException Si une erreur survient lors de la création du document PDF
     * @throws IOException Si une erreur d'entrée/sortie survient
     */
    default byte[] generateComparativeProfitabilityReport(LocalDate period1Start, LocalDate period1End,
                                                          LocalDate period2Start, LocalDate period2End)
            throws DocumentException, IOException {
        throw new UnsupportedOperationException("Méthode non implémentée");
    }

    /**
     * Génère un rapport PDF détaillé des coûts par ressource
     *
     * @param startDate Date de début de la période
     * @param endDate Date de fin de la période
     * @return Le rapport PDF sous forme de tableau d'octets
     * @throws DocumentException Si une erreur survient lors de la création du document PDF
     * @throws IOException Si une erreur d'entrée/sortie survient
     */
    default byte[] generateResourceCostReport(LocalDate startDate, LocalDate endDate)
            throws DocumentException, IOException {
        throw new UnsupportedOperationException("Méthode non implémentée");
    }

    /**
     * Génère un rapport PDF de rentabilité par culture
     *
     * @param startDate Date de début de la période
     * @param endDate Date de fin de la période
     * @return Le rapport PDF sous forme de tableau d'octets
     * @throws DocumentException Si une erreur survient lors de la création du document PDF
     * @throws IOException Si une erreur d'entrée/sortie survient
     */
    default byte[] generateCropProfitabilityReport(LocalDate startDate, LocalDate endDate)
            throws DocumentException, IOException {
        throw new UnsupportedOperationException("Méthode non implémentée");
    }

    /**
     * Génère un rapport PDF des KPIs (Indicateurs Clés de Performance)
     *
     * @param startDate Date de début de la période
     * @param endDate Date de fin de la période
     * @return Le rapport PDF sous forme de tableau d'octets
     * @throws DocumentException Si une erreur survient lors de la création du document PDF
     * @throws IOException Si une erreur d'entrée/sortie survient
     */
    default byte[] generateKPIReport(LocalDate startDate, LocalDate endDate)
            throws DocumentException, IOException {
        throw new UnsupportedOperationException("Méthode non implémentée");
    }

    /**
     * Génère un rapport PDF d'analyse des tendances
     *
     * @param startDate Date de début de la période d'analyse
     * @param endDate Date de fin de la période d'analyse
     * @return Le rapport PDF sous forme de tableau d'octets
     * @throws DocumentException Si une erreur survient lors de la création du document PDF
     * @throws IOException Si une erreur d'entrée/sortie survient
     */
    default byte[] generateTrendAnalysisReport(LocalDate startDate, LocalDate endDate)
            throws DocumentException, IOException {
        throw new UnsupportedOperationException("Méthode non implémentée");
    }

    /**
     * Génère un rapport PDF de prévisions de rentabilité
     *
     * @param basePeriodStart Date de début de la période de référence
     * @param basePeriodEnd Date de fin de la période de référence
     * @param forecastDays Nombre de jours à prévoir
     * @return Le rapport PDF sous forme de tableau d'octets
     * @throws DocumentException Si une erreur survient lors de la création du document PDF
     * @throws IOException Si une erreur d'entrée/sortie survient
     */
    default byte[] generateForecastReport(LocalDate basePeriodStart, LocalDate basePeriodEnd, int forecastDays)
            throws DocumentException, IOException {
        throw new UnsupportedOperationException("Méthode non implémentée");
    }
}