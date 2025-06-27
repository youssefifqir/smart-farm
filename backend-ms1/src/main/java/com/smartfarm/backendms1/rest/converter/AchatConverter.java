package com.smartfarm.backendms1.rest.converter;

import com.smartfarm.backendms1.bean.Achat;
import com.smartfarm.backendms1.bean.Product;
import com.smartfarm.backendms1.bean.Supplier;
import com.smartfarm.backendms1.dao.ProductRepository;
import com.smartfarm.backendms1.dao.SupplierRepository;
import com.smartfarm.backendms1.rest.dto.AchatDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AchatConverter {

    private final ProductRepository productRepo;
    private final SupplierRepository supplierRepo;

    public AchatDto toDto(Achat achat) {
        AchatDto dto = new AchatDto();
        dto.setId(achat.getId());
        dto.setQuantite(achat.getQuantite());
        dto.setPrixTotal(achat.getPrixTotal());
        dto.setDateAchat(achat.getDateAchat());
        dto.setProduitId(achat.getProduit().getId());
        dto.setFournisseurId(achat.getFournisseur().getId());
        return dto;
    }

    public Achat toEntity(AchatDto dto) {
        Product product   = productRepo.findById(dto.getProduitId()).orElseThrow();
        Supplier supplier = supplierRepo.findById(dto.getFournisseurId()).orElseThrow();

        Achat achat = new Achat();
        achat.setId(dto.getId());
        achat.setQuantite(dto.getQuantite());
        achat.setPrixTotal(dto.getPrixTotal());
        achat.setDateAchat(dto.getDateAchat());
        achat.setProduit(product);
        achat.setFournisseur(supplier);
        return achat;
    }
}
