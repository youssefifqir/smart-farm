package com.smartfarm.backendms1.service.impl;

import com.smartfarm.backendms1.bean.Achat;
import com.smartfarm.backendms1.bean.Product;
import com.smartfarm.backendms1.bean.Supplier;
import com.smartfarm.backendms1.dao.AchatRepository;
import com.smartfarm.backendms1.dao.CategoryRepository;
import com.smartfarm.backendms1.dao.ProductRepository;
import com.smartfarm.backendms1.dao.SupplierRepository;
import com.smartfarm.backendms1.rest.converter.AchatConverter;
import com.smartfarm.backendms1.rest.dto.AchatDto;
import com.smartfarm.backendms1.rest.dto.ProductDto;
import com.smartfarm.backendms1.service.facade.AchatService;
import jakarta.transaction.Transactional;
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

public class AchatServiceImpl implements AchatService {

    private final AchatRepository repo;
    private final AchatConverter converter;
    private final ProductRepository productRepository;
    private final AchatRepository achatRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;

    @Override
    @Transactional
    public AchatDto save(AchatDto dto) {

        Long produitId = dto.getProduit().getId();
        Product produit = productRepository.findById(produitId)
                .orElseThrow(() -> new RuntimeException("Produit avec ID " + produitId + " introuvable"));

        Long fournisseurId = dto.getFournisseur().getId();
        Supplier fournisseur = supplierRepository.findById(fournisseurId)
                .orElseThrow(() -> new RuntimeException("Fournisseur avec ID " + fournisseurId + " introuvable"));


        produit.setQuantite(produit.getQuantite() + dto.getQuantite());
        productRepository.save(produit);


        Achat achat = new Achat();
        achat.setQuantite(dto.getQuantite());
        achat.setPrixTotal(dto.getPrixTotal());
        achat.setDateAchat(dto.getDateAchat());
        achat.setProduit(produit);
        achat.setFournisseur(fournisseur);

        Achat saved = repo.save(achat);
        return converter.toDto(saved);
    }




    @Override
    public AchatDto update(Long id, AchatDto dto) {
        dto.setId(id);
        return converter.toDto(repo.save(converter.toEntity(dto)));
    }
    @Override
    public BigDecimal getTotalAchats() {
        return repo.findAll()
                .stream()
                .map(a -> a.getPrixTotal()==null?BigDecimal.ZERO:a.getPrixTotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public Map<String, BigDecimal> getAchatsMensuels() {
        return repo.findAll()
                .stream()
                .collect(Collectors.groupingBy(
                        a -> a.getDateAchat()
                                .getMonth()
                                .getDisplayName(TextStyle.SHORT, Locale.ENGLISH),   // "Jan"…
                        Collectors.mapping(Achat::getPrixTotal,
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));
    }

    @Override
    public AchatDto findById(Long id) {
        return repo.findById(id)
                .map(converter::toDto)
                .orElse(null);
    }

    @Override
    public List<AchatDto> findAll() {
        return repo.findAll()
                .stream()
                .map(converter::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        repo.deleteById(id);
    }
}
