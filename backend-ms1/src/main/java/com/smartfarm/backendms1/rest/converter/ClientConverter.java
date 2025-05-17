package com.smartfarm.backendms1.rest.converter;

import com.smartfarm.backendms1.rest.dto.ClientDto;
import com.smartfarm.backendms1.bean.Client;

public class ClientConverter {

    public static ClientDto toDto(Client entity) {
        ClientDto dto = new ClientDto();
        dto.setId(entity.getId());
        dto.setNom(entity.getNom());
        dto.setTelephone(entity.getTelephone());
        dto.setAdresse(entity.getAdresse());
        return dto;
    }

    public static Client toEntity(ClientDto dto) {
        Client entity = new Client();
        entity.setId(dto.getId());
        entity.setNom(dto.getNom());
        entity.setTelephone(dto.getTelephone());
        entity.setAdresse(dto.getAdresse());
        return entity;
    }
}
