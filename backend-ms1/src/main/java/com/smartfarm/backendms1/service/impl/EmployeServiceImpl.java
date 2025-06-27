package com.smartfarm.backendms1.service.impl;

import com.smartfarm.backendms1.dao.EmployeRepository;
import com.smartfarm.backendms1.rest.converter.EmployeConverter;
import com.smartfarm.backendms1.rest.dto.EmployeDto;
import com.smartfarm.backendms1.service.facade.EmployeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeServiceImpl implements EmployeService {

    private final EmployeRepository repo;
    private final EmployeConverter converter;

    @Override
    public EmployeDto save(EmployeDto dto) {
        return converter.toDto(repo.save(converter.toEntity(dto)));
    }

    @Override
    public EmployeDto update(Long id, EmployeDto dto) {
        dto.setId(id);
        return converter.toDto(repo.save(converter.toEntity(dto)));
    }

    @Override
    public EmployeDto findById(Long id) {
        return repo.findById(id).map(converter::toDto).orElse(null);
    }

    @Override
    public List<EmployeDto> findAll() {
        return repo.findAll().stream()
                .map(converter::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        repo.deleteById(id);
    }
}
