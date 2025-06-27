package com.smartfarm.backendms1.rest.converter;

import com.smartfarm.backendms1.bean.Vente;
import com.smartfarm.backendms1.bean.Product;
import com.smartfarm.backendms1.bean.Client;
import com.smartfarm.backendms1.dao.ProductRepository;
import com.smartfarm.backendms1.dao.ClientRepository;
import com.smartfarm.backendms1.rest.dto.VenteDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class VenteConverter {

    private final ProductRepository productRepo;
    private final ClientRepository  clientRepo;

    public VenteDto toDto(Vente v) {
        VenteDto d = new VenteDto();
        d.setId(v.getId());
        d.setQuantite(v.getQuantite());
        d.setPrixTotal(v.getPrixTotal());
        d.setDateVente(v.getDateVente());
        d.setProduitId(v.getProduit().getId());
        d.setClientId(v.getClient().getId());
        return d;
    }

    public Vente toEntity(VenteDto dto) {
        Product p = productRepo.findById(dto.getProduitId()).orElseThrow();
        Client  c = clientRepo.findById(dto.getClientId()).orElseThrow();

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
