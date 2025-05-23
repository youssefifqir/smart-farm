package com.smartfarm.backendms1.rest.ws;

import com.smartfarm.backendms1.bean.Client;
import com.smartfarm.backendms1.service.facade.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clients")
@CrossOrigin(origins = "*") // autorise le front-end à accéder
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }


    @GetMapping
    public ResponseEntity<List<Client>> findAll() {
        return ResponseEntity.ok(clientService.findAll());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Client> findById(@PathVariable Long id) {
        Client client = clientService.findById(id);
        return (client != null) ? ResponseEntity.ok(client) : ResponseEntity.notFound().build();
    }


    @PostMapping
    public ResponseEntity<Client> save(@RequestBody Client client) {
        Client saved = clientService.save(client);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> update(@PathVariable Long id, @RequestBody Client updatedClient) {
        Client existing = clientService.findById(id);
        if (existing == null) return ResponseEntity.notFound().build();

        updatedClient.setId(id);
        Client saved = clientService.save(updatedClient);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = clientService.deleteById(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
