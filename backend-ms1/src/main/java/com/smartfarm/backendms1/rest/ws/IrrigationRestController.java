package com.smartfarm.backendms1.rest.ws;

import com.smartfarm.backendms1.service.facade.IrrigationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/irrigation")
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
}
