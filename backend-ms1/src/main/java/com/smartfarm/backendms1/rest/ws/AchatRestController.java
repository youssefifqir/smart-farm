package com.smartfarm.backendms1.rest.ws;

import com.smartfarm.backendms1.rest.dto.AchatDto;
import com.smartfarm.backendms1.service.facade.AchatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

// src/main/java/com/smartfarm/backendms1/rest/ws/AchatRestController.java
@RestController
@RequestMapping("/api/achats")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5174")
public class AchatRestController {

    private final AchatService service;

    /* ---------- STATISTIQUES ---------- */

    @GetMapping("/total")
    public BigDecimal total() {
        return service.getTotalAchats();
    }

    @GetMapping("/mensuel")
    public Map<String, BigDecimal> mensuel() {
        return service.getAchatsMensuels();     // clé = "Janvier"…  valeur = somme BigDecimal
    }

    /* ---------- CRUD ---------- */

    @PostMapping
    public AchatDto save(@RequestBody AchatDto d){return service.save(d);}
    @GetMapping
    public List<AchatDto> all(){return service.findAll();}
    @GetMapping("/id/{id}")            public AchatDto one(@PathVariable Long id){return service.findById(id);}
    @PutMapping("/id/{id}")            public AchatDto upd(@PathVariable Long id, @RequestBody AchatDto d){return service.update(id,d);}
    @DeleteMapping("/id/{id}")         public void del(@PathVariable Long id){ service.deleteById(id);}
}
