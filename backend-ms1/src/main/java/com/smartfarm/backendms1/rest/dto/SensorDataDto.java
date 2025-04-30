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
    private LocalDateTime timestamp;
}

