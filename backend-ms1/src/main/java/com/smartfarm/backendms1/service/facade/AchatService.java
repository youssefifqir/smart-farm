package com.smartfarm.backendms1.service.facade;

import com.smartfarm.backendms1.rest.dto.AchatDto;

import java.util.List;

public interface AchatService {
    AchatDto save(AchatDto dto);
    AchatDto update(Long id, AchatDto dto);
    AchatDto findById(Long id);
    List<AchatDto> findAll();
    void deleteById(Long id);
}
