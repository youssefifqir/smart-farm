package com.smartfarm.backendms1.rest.converter;

import com.smartfarm.backendms1.bean.Employe;
import com.smartfarm.backendms1.rest.dto.EmployeDto;
import org.springframework.stereotype.Component;

@Component
public class EmployeConverter {

    public EmployeDto toDto(Employe e) {
        EmployeDto d = new EmployeDto();
        d.setId(e.getId());
        d.setNom(e.getNom());
        d.setPrenom(e.getPrenom());
        d.setEmail(e.getEmail());
        d.setPoste(e.getPoste());
        d.setSalaire(e.getSalaire());
        return d;
    }

    public Employe toEntity(EmployeDto dto) {
        Employe e = new Employe();
        e.setId(dto.getId());
        e.setNom(dto.getNom());
        e.setPrenom(dto.getPrenom());
        e.setEmail(dto.getEmail());
        e.setPoste(dto.getPoste());
        e.setSalaire(dto.getSalaire());
        return e;
    }
}
