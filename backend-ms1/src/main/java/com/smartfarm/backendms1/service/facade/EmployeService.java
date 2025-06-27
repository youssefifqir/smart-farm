package com.smartfarm.backendms1.service.facade;

import com.smartfarm.backendms1.rest.dto.EmployeDto;

import java.util.List;

public interface EmployeService {
    EmployeDto save(EmployeDto dto);
    EmployeDto update(Long id, EmployeDto dto);
    EmployeDto findById(Long id);
    List<EmployeDto> findAll();
    void deleteById(Long id);
}
