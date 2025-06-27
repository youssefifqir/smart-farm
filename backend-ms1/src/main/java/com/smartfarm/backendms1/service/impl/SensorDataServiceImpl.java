package com.smartfarm.backendms1.service.impl;

import com.smartfarm.backendms1.bean.SensorData;
import com.smartfarm.backendms1.dao.SensorRepository;
import com.smartfarm.backendms1.service.facade.SensorDataService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SensorDataServiceImpl implements SensorDataService {

    private final SensorRepository sensorRepository;

    public SensorDataServiceImpl(SensorRepository sensorRepository) {
        this.sensorRepository = sensorRepository;
    }

    @Override
    public int saveSensorData(SensorData sensorData) {
        try {
            sensorRepository.save(sensorData);
            return 1; // success
        } catch (Exception e) {
            e.printStackTrace();
            return 0; // failure
        }
    }

    public List<SensorData> getAllSensorData() {
        return sensorRepository.findAll();
    }
    }
