package com.smartfarm.backendms1.rest.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AchatDto {
    private Long id;
    private int quantite;
    private BigDecimal prixTotal;
    private LocalDateTime dateAchat;

    private ProductDto produit;     // 👈 Objet complet
    private SupplierDto fournisseur; // 👈 Objet complet


}
