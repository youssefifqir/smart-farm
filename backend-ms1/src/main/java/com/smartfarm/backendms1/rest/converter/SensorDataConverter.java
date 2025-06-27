package com.smartfarm.backendms1.rest.converter;

import com.smartfarm.backendms1.bean.SensorData;
import com.smartfarm.backendms1.rest.dto.SensorDataDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class SensorDataConverter {

    public SensorData toItem(SensorDataDto dto) {
        if (dto == null) {
            return null;
        } else {
            SensorData item = new SensorData();
            item.setTemperature(dto.getTemperature());
            item.setHumidity(dto.getHumidity());
            item.setIsFire(dto.getIsFire());
            item.setIsRaining(dto.getIsRaining());
            item.setSoilMoisture(dto.getSoilMoisture());
            item.setWaterConsumption(dto.getWaterConsumption());
            item.setTimestamp(dto.getTimestamp() != null ? dto.getTimestamp() : java.time.LocalDateTime.now());
            return item;
        }
    }

    public SensorDataDto toDto(SensorData item) {
        if (item == null) {
            return null;
        } else {
            SensorDataDto dto = new SensorDataDto();
            dto.setTemperature(item.getTemperature());
            dto.setHumidity(item.getHumidity());
            dto.setIsFire(item.getIsFire());
            dto.setIsRaining(item.getIsRaining());
            dto.setSoilMoisture(item.getSoilMoisture());
            dto.setWaterConsumption(item.getWaterConsumption());
            dto.setTimestamp(item.getTimestamp());
            return dto;
        }
    }

    public List<SensorData> toItems(List<SensorDataDto> dtos) {
        List<SensorData> items = new ArrayList<>();
        if (dtos != null && !dtos.isEmpty()) {
            for (SensorDataDto dto : dtos) {
                items.add(toItem(dto));
            }
        }
        return items;
    }

    public List<SensorDataDto> toDto(List<SensorData> items) {
        List<SensorDataDto> dtos = new ArrayList<>();
        if (items != null && !items.isEmpty()) {
            for (SensorData item : items) {
                dtos.add(toDto(item));
            }
        }
        return dtos;
    }
}
