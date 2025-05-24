package com.smartfarm.backendms1.service.impl;

import com.smartfarm.backendms1.bean.SensorData;
import com.smartfarm.backendms1.dao.SensorRepository;
import com.smartfarm.backendms1.service.facade.AlertService;
import com.smartfarm.backendms1.service.facade.SensorDataService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SensorDataServiceImpl implements SensorDataService {

    private final SensorRepository sensorRepository;
    private final AlertService alertService;

    public SensorDataServiceImpl(SensorRepository sensorRepository, AlertService alertService) {
        this.sensorRepository = sensorRepository;
        this.alertService = alertService;
    }

    @Override
    public int saveSensorData(SensorData sensorData) {
        try {
            sensorRepository.save(sensorData);
            alertService.check(sensorData); // 🔥🌧️ déclenche l’alerte
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
