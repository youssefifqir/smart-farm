package com.smartfarm.backendms1.service.impl;

import com.smartfarm.backendms1.bean.Client;
import com.smartfarm.backendms1.dao.ClientRepository;
import com.smartfarm.backendms1.service.facade.ClientService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;

    public ClientServiceImpl(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Override
    public List<Client> findAll() {
        return clientRepository.findAll();
    }

    @Override
    public Client findById(Long id) {
        Optional<Client> client = clientRepository.findById(id);
        return client.orElse(null);
    }

    @Override
    public Client save(Client client) {
        if (client.getId() != null && client.getId() != 0) {
            // mise à jour
            Optional<Client> existing = clientRepository.findById(client.getId());
            if (existing.isEmpty()) {
                throw new EntityNotFoundException("Client non trouvé avec id " + client.getId());
            }
        } else {
            client.setId(null);
        }
        return clientRepository.save(client);
    }

    @Override
    public boolean deleteById(Long id) {
        if (!clientRepository.existsById(id)) return false;
        clientRepository.deleteById(id);
        return true;
    }
}
