package com.smartfarm.backendms1.service.facade;

import com.smartfarm.backendms1.bean.Client;

import java.util.List;

public interface ClientService {

    List<Client> findAll();

    Client findById(Long id);

    Client save(Client client);

    boolean deleteById(Long id);
}
