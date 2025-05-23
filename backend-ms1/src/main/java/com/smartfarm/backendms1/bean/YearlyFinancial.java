package com.smartfarm.backendms1.bean;

public class YearlyFinancial {
    private String name;       // Année (par exemple "2023", "2024", etc.)
    private double revenue;    // Revenus pour cette année
    private double cost;       // Coûts pour cette année
    private double profit;     // Profit pour cette année

    public YearlyFinancial() {
    }

    public YearlyFinancial(String name, double revenue, double cost, double profit) {
        this.name = name;
        this.revenue = revenue;
        this.cost = cost;
        this.profit = profit;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getRevenue() {
        return revenue;
    }

    public void setRevenue(double revenue) {
        this.revenue = revenue;
    }

    public double getCost() {
        return cost;
    }

    public void setCost(double cost) {
        this.cost = cost;
    }

    public double getProfit() {
        return profit;
    }

    public void setProfit(double profit) {
        this.profit = profit;
    }
}
