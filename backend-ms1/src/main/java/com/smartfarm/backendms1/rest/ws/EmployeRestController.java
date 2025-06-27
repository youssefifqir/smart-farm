package com.smartfarm.backendms1.rest.ws;

import com.smartfarm.backendms1.rest.dto.EmployeDto;
import com.smartfarm.backendms1.service.facade.EmployeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employes")
@RequiredArgsConstructor
public class EmployeRestController {

    private final EmployeService service;

    @PostMapping
    public ResponseEntity<EmployeDto> save(@RequestBody EmployeDto dto) {
        return ResponseEntity.ok(service.save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeDto> update(@PathVariable Long id,
                                             @RequestBody EmployeDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeDto> get(@PathVariable Long id) {
        EmployeDto dto = service.findById(id);
        return dto != null ? ResponseEntity.ok(dto)
                : ResponseEntity.notFound().build();
    }

    @GetMapping
    public List<EmployeDto> list() {
        return service.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
