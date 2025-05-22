package com.smartfarm.backendms1.service.impl;

import com.smartfarm.backendms1.bean.Sensor;
import com.smartfarm.backendms1.dao.SensorRepositoryManagement;
import com.smartfarm.backendms1.service.facade.SensorServiceManagement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SensorServiceImplManagement implements SensorServiceManagement {

    @Autowired
    private SensorRepositoryManagement SensorRepositoryManagement;

    @Override
    public Sensor save(Sensor sensor) {
        if (sensor.getIsActive() == null) {
            sensor.setIsActive(false); // par défaut éteint
        }
        return SensorRepositoryManagement.save(sensor);
    }

    @Override
    public List<Sensor> findAll() {
        return SensorRepositoryManagement.findAll();
    }

    @Override
    public Sensor toggle(Long id) {
        Sensor sensor = SensorRepositoryManagement.findById(id).orElseThrow();
        sensor.setIsActive(!sensor.getIsActive());
        return SensorRepositoryManagement.save(sensor);
    }

    @Override
    public void deleteById(Long id) {
        SensorRepositoryManagement.deleteById(id);
    }

    // 🔍 Capteurs par type
    @Override
    public List<Sensor> findByType(String type) {
        return SensorRepositoryManagement.findByType(type);
    }

    // 🔌 Capteurs actifs/inactifs
    @Override
    public List<Sensor> findByIsActive(boolean isActive) {
        return isActive ?
                SensorRepositoryManagement.findByIsActiveTrue() :
                SensorRepositoryManagement.findByIsActiveFalse();
    }
}
