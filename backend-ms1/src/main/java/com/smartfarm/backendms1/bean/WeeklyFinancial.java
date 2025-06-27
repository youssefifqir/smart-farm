package com.smartfarm.backendms1.bean;

public class WeeklyFinancial {
    private String name;       // Nom de la semaine (par exemple "Semaine 1")
    private double revenue;    // Revenus pour cette semaine
    private double cost;       // Coûts pour cette semaine
    private double profit;     // Profit pour cette semaine

    public WeeklyFinancial() {
    }

    public WeeklyFinancial(String name, double revenue, double cost, double profit) {
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
