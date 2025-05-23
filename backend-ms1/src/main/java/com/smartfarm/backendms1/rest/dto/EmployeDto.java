package com.smartfarm.backendms1.rest.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class EmployeDto {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String poste;
    private BigDecimal salaire;
}
