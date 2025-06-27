package com.smartfarm.backendms1.service.impl;

import com.smartfarm.backendms1.dao.AchatRepository;
import com.smartfarm.backendms1.rest.converter.AchatConverter;
import com.smartfarm.backendms1.rest.dto.AchatDto;
import com.smartfarm.backendms1.service.facade.AchatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AchatServiceImpl implements AchatService {

    private final AchatRepository repo;
    private final AchatConverter converter;

    @Override
    public AchatDto save(AchatDto dto) {
        return converter.toDto(repo.save(converter.toEntity(dto)));
    }

    @Override
    public AchatDto update(Long id, AchatDto dto) {
        dto.setId(id);
        return converter.toDto(repo.save(converter.toEntity(dto)));
    }

    @Override
    public AchatDto findById(Long id) {
        return repo.findById(id)
                .map(converter::toDto)
                .orElse(null);
    }

    @Override
    public List<AchatDto> findAll() {
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
