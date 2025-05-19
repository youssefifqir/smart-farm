package com.smartfarm.backendms1.bean;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProfitabilityReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private double waterCost;
    private double energyCost;
    private Double  sensorMaintenanceCost;
    private double totalCost;
    private double estimatedRevenue;
    private double profit;
    private Double profitMargin;

    private String timeframe;
    @Enumerated(EnumType.STRING)
    private CropType cropType;
    @Enumerated(EnumType.STRING)
    private Zone zone;

    private Double laborCost;
    private Double fertilizerCost;
    private Double otherCosts;
    private Double yieldAmount ;
}
