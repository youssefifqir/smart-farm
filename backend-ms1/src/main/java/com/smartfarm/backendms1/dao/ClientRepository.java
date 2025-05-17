package com.smartfarm.backendms1.dao;

import com.smartfarm.backendms1.bean.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Client findByNom(String nom);


    List<Client> findByAdresseContaining(String adressePartielle);

    List<Client> findAllByOrderByNomAsc();
}
