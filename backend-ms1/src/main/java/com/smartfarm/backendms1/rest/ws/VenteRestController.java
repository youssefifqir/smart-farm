package com.smartfarm.backendms1.rest.ws;

import com.smartfarm.backendms1.rest.dto.VenteDto;
import com.smartfarm.backendms1.service.facade.VenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ventes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5174")

public class VenteRestController {

    private final VenteService service;

    @PostMapping
    public ResponseEntity<VenteDto> save(@RequestBody VenteDto dto) {
        return ResponseEntity.ok(service.save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VenteDto> update(@PathVariable Long id,
                                           @RequestBody VenteDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VenteDto> get(@PathVariable Long id) {
        VenteDto dto = service.findById(id);
        return dto != null ? ResponseEntity.ok(dto)
                : ResponseEntity.notFound().build();
    }

    @GetMapping
    public List<VenteDto> list() {
        return service.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/total")    public BigDecimal total(){ return service.getTotalVentes(); }
    @GetMapping("/mensuel")  public Map<String,BigDecimal> mensuel(){ return service.getVentesMensuelles(); }

}
