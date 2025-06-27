package com.smartfarm.backendms1.service.impl;

import com.smartfarm.backendms1.bean.Product;
import com.smartfarm.backendms1.bean.Vente;
import com.smartfarm.backendms1.dao.ProductRepository;
import com.smartfarm.backendms1.dao.VenteRepository;
import com.smartfarm.backendms1.rest.converter.VenteConverter;
import com.smartfarm.backendms1.rest.dto.VenteDto;
import com.smartfarm.backendms1.service.facade.VenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VenteServiceImpl implements VenteService {

    private final VenteRepository repo;
    private final VenteConverter converter;
    private final ProductRepository productRepository;

    @Override
    public VenteDto save(VenteDto dto) {
        // Charger le produit depuis la base de données avec l'ID contenu dans dto.getProduit().getId()
        Product produit = productRepository.findById(dto.getProduit().getId())
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec ID : " + dto.getProduit().getId()));

        // Vérifier la quantité disponible
        if (produit.getQuantite() < dto.getQuantite()) {
            throw new RuntimeException("Quantité insuffisante pour le produit : " + produit.getNom());
        }

        // Décrémenter le stock
        produit.setQuantite(produit.getQuantite() - dto.getQuantite());
        productRepository.save(produit); // Enregistrer la mise à jour du produit

        // Créer l'entité Vente avec les données mises à jour
        Vente vente = converter.toEntity(dto);

        Vente saved = repo.save(vente);
        return converter.toDto(saved);
    }

    @Override
    public VenteDto update(Long id, VenteDto dto) {
        dto.setId(id);
        return converter.toDto(repo.save(converter.toEntity(dto)));
    }

    @Override
    public VenteDto findById(Long id) {
        return repo.findById(id)
                .map(converter::toDto)
                .orElse(null);
    }

    @Override
    public List<VenteDto> findAll() {
        return repo.findAll()
                .stream()
                .map(converter::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        repo.deleteById(id);
    }

    @Override
    public BigDecimal getTotalVentes() {
        return repo.findAll()                       // VenteRepository
                .stream()
                .map(v -> v.getPrixTotal() == null ? BigDecimal.ZERO : v.getPrixTotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /* ----------------------------------------------------------------
       Agrégat “ventes par mois”  (clé = "Jan", "Feb", …)
       ---------------------------------------------------------------- */
    @Override
    public Map<String, BigDecimal> getVentesMensuelles() {
        return repo.findAll()
                .stream()
                .collect(Collectors.groupingBy(
                        v -> v.getDateVente()        // LocalDateTime
                                .getMonth()
                                .getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                        Collectors.mapping(Vente::getPrixTotal,
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));
    }
}
