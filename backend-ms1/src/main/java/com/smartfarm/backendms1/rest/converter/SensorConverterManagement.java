package com.smartfarm.backendms1.rest.converter;

import com.smartfarm.backendms1.bean.Sensor;
import com.smartfarm.backendms1.rest.dto.SensorDtoManagement;
import org.springframework.stereotype.Component;

@Component
public class SensorConverterManagement {

    // 🔁 Convertir entité -> DTO
    public SensorDtoManagement toDto(Sensor sensor) {
        if (sensor == null) return null;

        SensorDtoManagement dto = new SensorDtoManagement();
        dto.setId(sensor.getId());
        dto.setName(sensor.getName());
        dto.setType(sensor.getType());
        dto.setIsActive(sensor.getIsActive());
        dto.setLocation(sensor.getLocation());

        return dto;
    }

    // 🔁 Convertir DTO -> entité
    public Sensor toEntity(SensorDtoManagement dto) {
        if (dto == null) return null;

        Sensor sensor = new Sensor();
        sensor.setId(dto.getId());
        sensor.setName(dto.getName());
        sensor.setType(dto.getType());
        sensor.setIsActive(dto.getIsActive());
        sensor.setLocation(dto.getLocation());

        return sensor;
    }
}
