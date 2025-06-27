package com.smartfarm.backendms1.rest.converter;

import com.smartfarm.backendms1.bean.Vente;
import com.smartfarm.backendms1.bean.Product;
import com.smartfarm.backendms1.bean.Client;
import com.smartfarm.backendms1.dao.ProductRepository;
import com.smartfarm.backendms1.dao.ClientRepository;
import com.smartfarm.backendms1.rest.dto.VenteDto;
import com.smartfarm.backendms1.rest.converter.ProductConverter;
import com.smartfarm.backendms1.rest.converter.ClientConverter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class VenteConverter {

    private final ProductRepository productRepo;
    private final ClientRepository clientRepo;
    private final ProductConverter productConverter;
    private final ClientConverter clientConverter;

    public VenteDto toDto(Vente v) {
        VenteDto dto = new VenteDto();
        dto.setId(v.getId());
        dto.setQuantite(v.getQuantite());
        dto.setPrixTotal(v.getPrixTotal());
        dto.setDateVente(v.getDateVente());

        dto.setProduit(productConverter.toDto(v.getProduit()));
        dto.setClient(clientConverter.toDto(v.getClient()));
        return dto;
    }

    public Vente toEntity(VenteDto dto) {
        Product p = productRepo.findById(dto.getProduit().getId()).orElseThrow();
        Client c = clientRepo.findById(dto.getClient().getId()).orElseThrow();

        Vente v = new Vente();
        v.setId(dto.getId());
        v.setQuantite(dto.getQuantite());
        v.setPrixTotal(dto.getPrixTotal());
        v.setDateVente(dto.getDateVente());
        v.setProduit(p);
        v.setClient(c);
        return v;
    }
}
