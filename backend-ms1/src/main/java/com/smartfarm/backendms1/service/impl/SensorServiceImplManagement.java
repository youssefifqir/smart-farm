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
    private SensorRepositoryManagement sensorRepositoryManagement;

    @Override
    public Sensor save(Sensor sensor) {
        if (sensor.getIsActive() == null) {
            sensor.setIsActive(false); // par défaut : désactivé
        }
        return sensorRepositoryManagement.save(sensor);
    }

    @Override
    public List<Sensor> findAll() {
        return sensorRepositoryManagement.findAll();
    }

    @Override
    public Sensor toggle(Long id) {
        Sensor sensor = sensorRepositoryManagement.findById(id)
                .orElseThrow(() -> new RuntimeException("Sensor not found with id: " + id));
        sensor.setIsActive(!sensor.getIsActive());
        return sensorRepositoryManagement.save(sensor);
    }

    @Override
    public void deleteById(Long id) {
        sensorRepositoryManagement.deleteById(id);
    }

    @Override
    public List<Sensor> findByType(String type) {
        return sensorRepositoryManagement.findByType(type);
    }

    @Override
    public List<Sensor> findByIsActive(boolean isActive) {
        return isActive
                ? sensorRepositoryManagement.findByIsActiveTrue()
                : sensorRepositoryManagement.findByIsActiveFalse();
    }

    @Override
    public List<Sensor> findByLocation(String location) {
        return sensorRepositoryManagement.findByLocation(location);
    }

    @Override
    public Sensor findByName(String name) {
        return sensorRepositoryManagement.findByName(name);
    }

    @Override
    public int changeStatusByName(String name, Boolean status) {
        return sensorRepositoryManagement.updateSensorStatusByName(name, status);
    }
}
