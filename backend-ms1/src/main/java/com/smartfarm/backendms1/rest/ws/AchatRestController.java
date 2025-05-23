package com.smartfarm.backendms1.rest.ws;

import com.smartfarm.backendms1.rest.dto.AchatDto;
import com.smartfarm.backendms1.service.facade.AchatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achats")
@RequiredArgsConstructor
public class AchatRestController {

    private final AchatService service;

    @PostMapping
    public ResponseEntity<AchatDto> save(@RequestBody AchatDto dto) {
        return ResponseEntity.ok(service.save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AchatDto> update(@PathVariable Long id,
                                           @RequestBody AchatDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AchatDto> get(@PathVariable Long id) {
        AchatDto dto = service.findById(id);
        return dto != null ? ResponseEntity.ok(dto)
                : ResponseEntity.notFound().build();
    }

    @GetMapping
    public List<AchatDto> list() {
        return service.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
