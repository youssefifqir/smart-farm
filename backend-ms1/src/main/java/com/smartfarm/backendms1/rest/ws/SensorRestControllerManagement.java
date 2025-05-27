package com.smartfarm.backendms1.rest.ws;

import com.smartfarm.backendms1.bean.Sensor;
import com.smartfarm.backendms1.rest.converter.SensorConverterManagement;
import com.smartfarm.backendms1.rest.dto.SensorDtoManagement;
import com.smartfarm.backendms1.service.facade.SensorServiceManagement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/sensors")
public class SensorRestControllerManagement {

    @Autowired
    private SensorServiceManagement sensorService;

    @Autowired
    private SensorConverterManagement sensorConverter;  // ✅ minuscule ici

    // ➕ Créer un capteur
    @PostMapping("/")
    public SensorDtoManagement create(@RequestBody SensorDtoManagement dto) {
        Sensor saved = sensorService.save(sensorConverter.toEntity(dto));
        return sensorConverter.toDto(saved);
    }

    // 📋 Lister tous les capteurs
    @GetMapping("/")
    public List<SensorDtoManagement> findAll() {
        return sensorService.findAll()
                .stream()
                .map(sensorConverter::toDto)
                .collect(Collectors.toList());
    }

    // 🔁 Activer / Désactiver un capteur
    @PutMapping("/{id}/toggle")
    public SensorDtoManagement toggle(@PathVariable Long id) {
        Sensor updated = sensorService.toggle(id);
        return sensorConverter.toDto(updated);
    }

    // ❌ Supprimer un capteur
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        sensorService.deleteById(id);
    }

    // 🔍 Chercher par type
    @GetMapping("/type/{type}")
    public List<SensorDtoManagement> findByType(@PathVariable String type) {
        return sensorService.findByType(type)
                .stream()
                .map(sensorConverter::toDto)
                .collect(Collectors.toList());
    }

    // 🔌 Obtenir tous les capteurs actifs
    @GetMapping("/active")
    public List<SensorDtoManagement> findActive() {
        return sensorService.findByIsActive(true)
                .stream()
                .map(sensorConverter::toDto)
                .collect(Collectors.toList());
    }

    // 🔌 Obtenir tous les capteurs inactifs
    @GetMapping("/inactive")
    public List<SensorDtoManagement> findInactive() {
        return sensorService.findByIsActive(false)
                .stream()
                .map(sensorConverter::toDto)
                .collect(Collectors.toList());
    }

    @PutMapping("/status")
public ResponseEntity<?> updateStatusByName(
        @RequestParam String name,
        @RequestParam Boolean status) {
    int result = sensorService.changeStatusByName(name, status);
    if (result > 0) {
        Sensor updatedSensor = sensorService.findByName(name);
        return ResponseEntity.ok(sensorConverter.toDto(updatedSensor));
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Capteur '" + name + "' introuvable.");
    }
}
@GetMapping("/location/{location}")
public List<SensorDtoManagement> findByLocation(@PathVariable String location) {
    return sensorService.findByLocation(location)
            .stream()
            .map(sensorConverter::toDto)
            .collect(Collectors.toList());
}


}
