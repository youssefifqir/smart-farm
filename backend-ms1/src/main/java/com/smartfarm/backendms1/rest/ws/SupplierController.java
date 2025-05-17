package com.smartfarm.backendms1.rest.ws;

import com.smartfarm.backendms1.bean.Supplier;
import com.smartfarm.backendms1.service.facade.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/suppliers")
@CrossOrigin(origins = "*")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    public ResponseEntity<List<Supplier>> findAll() {
        return ResponseEntity.ok(supplierService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supplier> findById(@PathVariable Long id) {
        Supplier supplier = supplierService.findById(id);
        return (supplier != null) ? ResponseEntity.ok(supplier) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Supplier> save(@RequestBody Supplier supplier) {
        Supplier saved = supplierService.save(supplier);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Supplier> update(@PathVariable Long id, @RequestBody Supplier supplier) {
        Supplier existing = supplierService.findById(id);
        if (existing == null) return ResponseEntity.notFound().build();

        supplier.setId(id);
        Supplier updated = supplierService.save(supplier);
        return ResponseEntity.  ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = supplierService.deleteById(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
