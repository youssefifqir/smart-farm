package com.smartfarm.backendms1.bean;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private BigDecimal prix;
    private int quantite;

    @ManyToOne
    @JoinColumn()
    private Category category;
    @Enumerated(EnumType.STRING)

    private Zone zone;


}
