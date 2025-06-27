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
    private final ProductConverter productConverter;
    private final SupplierConverter supplierConverter;

    public AchatDto toDto(Achat achat) {
        AchatDto dto = new AchatDto();
        dto.setId(achat.getId());
        dto.setQuantite(achat.getQuantite());
        dto.setPrixTotal(achat.getPrixTotal());
        dto.setDateAchat(achat.getDateAchat());
        dto.setProduit(productConverter.toDto(achat.getProduit()));
        dto.setFournisseur(supplierConverter.toDto(achat.getFournisseur()));
        return dto;
    }

    public Achat toEntity(AchatDto dto) {
        Product product = productRepo.findById(dto.getProduit().getId()).orElseThrow();
        Supplier supplier = supplierRepo.findById(dto.getFournisseur().getId()).orElseThrow();

        Achat achat = new Achat();
        achat.setId(dto.getId());
        achat.setQuantite(dto.getQuantite());
        achat.setPrixTotal(dto.getPrixTotal()); // reste double
        achat.setDateAchat(dto.getDateAchat());
        achat.setProduit(product);
        achat.setFournisseur(supplier);
        return achat;
    }
}
