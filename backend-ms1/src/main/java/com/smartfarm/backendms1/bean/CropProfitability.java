package com.smartfarm.backendms1.bean;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CropProfitability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double revenue;
    private double cost;
    private double profit;

    public CropProfitability(String name, double revenue, double cost, double profit) {
        this.name = name;
        this.revenue = revenue;
        this.cost = cost;
        this.profit = profit;
    }
}
