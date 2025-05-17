package com.smartfarm.backendms1.rest.converter;

import com.smartfarm.backendms1.bean.Category;
import com.smartfarm.backendms1.rest.dto.CategoryDto;
import com.smartfarm.backendms1.bean.Product;

import java.util.List;
import java.util.stream.Collectors;

public class CategoryConverter {

    public static CategoryDto toDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setNom(category.getNom());


        return dto;
    }

    public static Category toEntity(CategoryDto dto) {
        Category category = new Category();
        category.setId(dto.getId());
        category.setNom(dto.getNom());



        return category;
    }
}
