package com.smartfarm.backendms1.rest.ws;

import com.smartfarm.backendms1.service.facade.IrrigationService;
import com.smartfarm.backendms1.rest.dto.IrrigationScheduleRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/v1/irrigation")
@CrossOrigin(origins = "http://localhost:5173")
public class IrrigationRestController {

    private final IrrigationService irrigationService;

    public IrrigationRestController(IrrigationService irrigationService) {
        this.irrigationService = irrigationService;
    }

    @PostMapping("/start")
    public ResponseEntity<String> startIrrigation() {
        irrigationService.startWatering();
        return ResponseEntity.ok("✅ Arrosage déclenché avec succès !");
    }

    @PostMapping("/schedule")
public ResponseEntity<String> scheduleIrrigation(@RequestBody IrrigationScheduleRequest request) {
    System.out.println("🗓️ Arrosage programmé :");
    System.out.println("➡️ Zone: " + request.getZone());
    System.out.println("🕒 Heure: " + request.getTime());
    System.out.println("⏳ Durée: " + request.getDuration() + " minutes");

    // ✅ Ajout essentiel : appel du service
    LocalTime time = LocalTime.parse(request.getTime(), DateTimeFormatter.ofPattern("HH:mm"));
    irrigationService.scheduleWatering(request.getZone(), time, request.getDuration());

    return ResponseEntity.ok("✅ Arrosage programmé avec succès !");
}


}
