package com.smartfarm.backendms1.rest.ws;

import com.smartfarm.backendms1.bean.Category;
import com.smartfarm.backendms1.service.facade.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {
    

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // GET
    @GetMapping
    public ResponseEntity<List<Category>> findAll() {
        return ResponseEntity.ok(categoryService.findAll());
    }

    // GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<Category> findById(@PathVariable Long id) {
        Category category = categoryService.findById(id);
        return (category != null) ? ResponseEntity.ok(category) : ResponseEntity.notFound().build();
    }

    // POST
    @PostMapping
    public ResponseEntity<Integer> save(@RequestBody Category category) {
        int saved = categoryService.save(category);
        return ResponseEntity.status(201).body(saved);
    }

    // PUT
    @PutMapping("/{id}")
    public ResponseEntity<Integer> update(@PathVariable Long id, @RequestBody Category updatedCategory) {
        Category existing = categoryService.findById(id);
        if (existing == null) return ResponseEntity.notFound().build();

        updatedCategory.setId(id);
        int saved = categoryService.save(updatedCategory);
        return ResponseEntity.ok(saved);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = categoryService.deleteById(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
