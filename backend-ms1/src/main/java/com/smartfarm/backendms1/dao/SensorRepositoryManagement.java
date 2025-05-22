package com.smartfarm.backendms1.dao;

import com.smartfarm.backendms1.bean.Sensor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SensorRepositoryManagement extends JpaRepository<Sensor, Long> {

    // 🔍 Trouver les capteurs par type (ex : "temperature", "humidity", etc.)
    List<Sensor> findByType(String type);

    // 🔌 Récupérer uniquement les capteurs actifs
    List<Sensor> findByIsActiveTrue();

    // 🔌 Récupérer uniquement les capteurs inactifs
    List<Sensor> findByIsActiveFalse();

    // 🔍 Chercher par emplacement
    List<Sensor> findByLocation(String location);
}
