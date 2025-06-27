package com.smartfarm.backendms1.dao;

import com.smartfarm.backendms1.bean.Vente;
import com.smartfarm.backendms1.bean.Product;
import com.smartfarm.backendms1.bean.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VenteRepository extends JpaRepository<Vente, Long> {

    List<Vente> findByProduit(Product produit);
    List<Vente> findByClient(Client client);
    List<Vente> findByDateVenteBetween(LocalDateTime start, LocalDateTime end);
    List<Vente> findByQuantiteLessThan(int quantite);
    List<Vente> findAllByOrderByDateVenteDesc();
}
