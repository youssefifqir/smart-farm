package com.smartfarm.backendms1.rest.converter;

import com.smartfarm.backendms1.bean.Product;
import com.smartfarm.backendms1.rest.dto.ProductDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ProductConverter {

    public Product toItem(ProductDto dto) {
        if (dto == null) return null;
        Product item = new Product();
        item.setId(dto.getId());
        item.setNom(dto.getName());
        item.setQuantite(dto.getQuantity());
        item.setPrix(dto.getPrice());

        return item;
    }

    public ProductDto toDto(Product item) {
        if (item == null) return null;
        ProductDto dto = new ProductDto();
        dto.setId(item.getId());
        dto.setName(item.getNom());
        dto.setQuantity(item.getQuantite());
        dto.setPrice(item.getPrix());
        return dto;
    }

    public List<Product> toItems(List<ProductDto> dtos) {
        List<Product> items = new ArrayList<>();
        if (dtos != null && !dtos.isEmpty()) {
            for (ProductDto dto : dtos) {
                items.add(toItem(dto));
            }
        }
        return items;
    }

    public List<ProductDto> toDtos(List<Product> items) {
        List<ProductDto> dtos = new ArrayList<>();
        if (items != null && !items.isEmpty()) {
            for (Product item : items) {
                dtos.add(toDto(item));
            }
        }
        return dtos;
    }
}
