package com.smartfarm.backendms1.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

// src/main/java/com/smartfarm/backendms1/rest/dto/MonthStatDto.java
@Data
@AllArgsConstructor
public class MonthStatDto {
    private String month;       // "Jan", "Feb", …
    private BigDecimal achats;
    private BigDecimal ventes;
}
