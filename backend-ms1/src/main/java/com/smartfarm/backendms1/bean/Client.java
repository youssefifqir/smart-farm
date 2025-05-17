package com.smartfarm.backendms1.bean;

import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@Entity
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private String telephone;

    private String adresse;
}
