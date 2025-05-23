package com.smartfarm.backendms1.dao;

import com.smartfarm.backendms1.bean.Achat;
import com.smartfarm.backendms1.bean.Product;
import com.smartfarm.backendms1.bean.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AchatRepository extends JpaRepository<Achat, Long> {


    List<Achat> findByProduit(Product produit);

    List<Achat> findByFournisseur(Supplier fournisseur);
    List<Achat> findByDateAchatBetween(LocalDateTime start, LocalDateTime end);

    List<Achat> findByQuantiteLessThan(int quantite);

    List<Achat> findAllByOrderByDateAchatDesc();
}
