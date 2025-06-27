package com.smartfarm.backendms1.service.impl;

import com.smartfarm.backendms1.dao.VenteRepository;
import com.smartfarm.backendms1.rest.converter.VenteConverter;
import com.smartfarm.backendms1.rest.dto.VenteDto;
import com.smartfarm.backendms1.service.facade.VenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VenteServiceImpl implements VenteService {

    private final VenteRepository repo;
    private final VenteConverter converter;

    @Override
    public VenteDto save(VenteDto dto) {
        return converter.toDto(repo.save(converter.toEntity(dto)));
    }

    @Override
    public VenteDto update(Long id, VenteDto dto) {
        dto.setId(id);
        return converter.toDto(repo.save(converter.toEntity(dto)));
    }

    @Override
    public VenteDto findById(Long id) {
        return repo.findById(id)
                .map(converter::toDto)
                .orElse(null);
    }

    @Override
    public List<VenteDto> findAll() {
        return repo.findAll()
                .stream()
                .map(converter::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        repo.deleteById(id);
    }
}
