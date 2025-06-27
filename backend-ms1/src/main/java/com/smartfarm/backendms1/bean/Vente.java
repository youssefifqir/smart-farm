package com.smartfarm.backendms1.bean;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Vente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantite;

    private BigDecimal prixTotal;

    private LocalDateTime dateVente;

    @ManyToOne
    @JoinColumn()
    private Product produit;

    @ManyToOne
    @JoinColumn()
    private Client client;
}
