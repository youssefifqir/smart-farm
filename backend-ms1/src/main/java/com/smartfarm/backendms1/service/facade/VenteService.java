package com.smartfarm.backendms1.service.facade;

import com.smartfarm.backendms1.rest.dto.VenteDto;

import java.util.List;

public interface VenteService {
    VenteDto save(VenteDto dto);
    VenteDto update(Long id, VenteDto dto);
    VenteDto findById(Long id);
    List<VenteDto> findAll();
    void deleteById(Long id);
}
