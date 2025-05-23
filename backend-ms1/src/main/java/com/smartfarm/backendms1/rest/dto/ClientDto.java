package com.smartfarm.backendms1.rest.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientDto {
    private Long id;

    private String nom;

    private String telephone;

    private String adresse;
}
