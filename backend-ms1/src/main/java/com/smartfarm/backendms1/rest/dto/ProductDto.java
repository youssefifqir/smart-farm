package com.smartfarm.backendms1.rest.dto;

import com.smartfarm.backendms1.bean.Category;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
public class ProductDto {
    private Long id;
    private String name;
    private int quantity;
    private BigDecimal price;
    private Category category;

    // Getters & Setters
}
