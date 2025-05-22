package com.smartfarm.backendms1.service.facade;

import com.smartfarm.backendms1.bean.Sensor;

import java.util.List;

public interface SensorServiceManagement {
    Sensor save(Sensor sensor);
    List<Sensor> findAll();
    Sensor toggle(Long id);
    void deleteById(Long id);

    // 👇 Nouvelles méthodes
    List<Sensor> findByType(String type);
    List<Sensor> findByIsActive(boolean isActive);
}
