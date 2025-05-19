package com.smartfarm.backendms1.rest.dto;

import com.smartfarm.backendms1.bean.CropType;
import com.smartfarm.backendms1.bean.Zone;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter

public class ProfitabilityReportDto {
    private LocalDate date;                      // Date du rapport
    private double waterCost;                    // Coût de l'eau
    private double energyCost;                   // Coût de l'énergie
    private double sensorMaintenanceCost;       // Coût de maintenance des capteurs
    private double totalCost;                    // Coût total
    private double estimatedRevenue;             // Revenu estimé
    private double profit;                       // Profit généré
    private Double profitMargin;                 // Marge bénéficiaire

    private String timeframe;                    // Période de temps (par exemple : "daily", "weekly", etc.)

    // Enumérations
    private CropType cropType;                  // Type de culture (par exemple : WHEAT, CORN, etc.)
    private Zone zone;                           // Zone géographique (par exemple : NORTH, SOUTH, etc.)

    // Autres coûts
    private Double laborCost;                   // Coût du travail
    private Double fertilizerCost;              // Coût de l'engrais
    private Double otherCosts;                  // Autres coûts (par exemple, coûts supplémentaires)

    private Double yieldAmount;
}
