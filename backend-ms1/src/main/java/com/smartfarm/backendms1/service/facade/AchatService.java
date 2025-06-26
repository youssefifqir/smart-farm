package com.smartfarm.backendms1.service.facade;

import com.smartfarm.backendms1.rest.dto.AchatDto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface AchatService {
    AchatDto save(AchatDto dto);
    AchatDto update(Long id, AchatDto dto);
    AchatDto findById(Long id);
    List<AchatDto> findAll();
    void deleteById(Long id);
    BigDecimal getTotalAchats();

    Map<String, BigDecimal> getAchatsMensuels();
}
