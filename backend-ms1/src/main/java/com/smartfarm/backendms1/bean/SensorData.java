package com.smartfarm.backendms1.bean;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SensorData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double temperature;
    private Double humidity;
    private Boolean isFire;
    private Boolean isRaining;
    private Double waterConsumption;     // Capteur de débit d’eau
    private Double soilMoisture;         // Capteur d’humidité du sol

    private Double pressure;             // BMP180/BME280

    private LocalDateTime timestamp = LocalDateTime.now(); //lw9ita fin sauvgardina had les infos

    @ManyToOne
    @JoinColumn(name = "sensor_id")
    private Sensor sensor;
}
