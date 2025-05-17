package com.smartfarm.backendms1.rest.converter;

import com.smartfarm.backendms1.bean.Supplier;
import com.smartfarm.backendms1.rest.dto.SupplierDto;
import org.springframework.stereotype.Component;

@Component
public class SupplierConverter {

    public SupplierDto toDto(Supplier entity) {
        SupplierDto dto = new SupplierDto();
        dto.setId(entity.getId());
        dto.setNom(entity.getNom());
        dto.setAdresse(entity.getAdresse());
        dto.setTelephone(entity.getTelephone());
        return dto;
    }

    public Supplier toEntity(SupplierDto dto) {
        Supplier entity = new Supplier();
        entity.setId(dto.getId());
        entity.setNom(dto.getNom());
        entity.setAdresse(dto.getAdresse());
        entity.setTelephone(dto.getTelephone());
        return entity;
    }
}
