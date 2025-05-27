package com.smartfarm.backendms1.dao;

import com.smartfarm.backendms1.bean.Sensor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface SensorRepositoryManagement extends JpaRepository<Sensor, Long> {

    // 🔍 Trouver les capteurs par type (ex : "temperature", "humidity", etc.)
    List<Sensor> findByType(String type);

    // 🔌 Récupérer uniquement les capteurs actifs
    List<Sensor> findByIsActiveTrue();

    // 🔌 Récupérer uniquement les capteurs inactifs
    List<Sensor> findByIsActiveFalse();
    
    Sensor findByName(String name);

    // 🔍 Chercher par emplacement
    List<Sensor> findByLocation(String location);

    // ✅ Activer/Désactiver un capteur par ID
    @Transactional
    @Modifying
    @Query("UPDATE Sensor s SET s.isActive = :status WHERE s.id = :id")
    int updateSensorStatus(Long id, Boolean status);


    @Transactional
    @Modifying
    @Query("UPDATE Sensor s SET s.isActive = :status WHERE s.name = :name")
    int updateSensorStatusByName(String name, Boolean status);

}
