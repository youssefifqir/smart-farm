package com.smartfarm.backendms1.rest.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class VenteDto {
    private Long id;
    private int quantite;
    private BigDecimal prixTotal;
    private LocalDateTime dateVente;

    private ProductDto produit;  // 👈 nom clair
    private ClientDto client;    // 👈 nom clair
}
