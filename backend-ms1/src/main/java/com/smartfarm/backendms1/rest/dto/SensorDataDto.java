package com.smartfarm.backendms1.rest.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SensorDataDto {
    private Double temperature;
    private Double humidity;
    private Boolean isFire;
    private Boolean isRaining;
    private Double waterConsumption;     // Capteur de débit d’eau
    private Double soilMoisture;         // Capteur d’humidité du sol

    private Double pressure;             // BMP180/BME280

    private LocalDateTime timestamp;
}

