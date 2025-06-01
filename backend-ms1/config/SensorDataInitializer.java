package com.smartfarm.backendms1.config;

import com.smartfarm.backendms1.bean.Sensor;
import com.smartfarm.backendms1.dao.SensorRepositoryManagement;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class SensorDataInitializer implements CommandLineRunner {

    private final SensorRepositoryManagement sensorRepository;

    public SensorDataInitializer(SensorRepository sensorRepository) {
        this.sensorRepository = sensorRepository;
    }

    @Override
    public void run(String... args) {
        if (sensorRepository.count() == 0) {
            sensorRepository.save(new Sensor(null, "Capteur Température 1", "temperature", true, "Zone Nord"));
            sensorRepository.save(new Sensor(null, "Capteur Température 2", "temperature", false, "Zone Sud"));
            sensorRepository.save(new Sensor(null, "Capteur Humidité 1", "humidity", true, "Serre A"));
            sensorRepository.save(new Sensor(null, "Détecteur de pluie", "rain", false, "Extérieur"));
            sensorRepository.save(new Sensor(null, "Capteur d’incendie", "fire", true, "Zone Est"));
            sensorRepository.save(new Sensor(null, "Capteur Température 3", "temperature", false, "Zone Ouest"));
            sensorRepository.save(new Sensor(null, "Capteur Humidité 2", "humidity", false, "Serre B"));
            System.out.println("✅ Capteurs initialisés");
        } else {
            System.out.println("ℹ️ Capteurs déjà existants");
        }
    }
}
