package com.smartfarm.backendms1.rest.ws;

import com.smartfarm.backendms1.rest.dto.MonthStatDto;

import java.math.BigDecimal;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.smartfarm.backendms1.service.facade.AchatService;
import com.smartfarm.backendms1.service.facade.VenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

// src/main/java/com/smartfarm/backendms1/rest/ws/StatsRestController.java
@RestController
@RequestMapping("/api/statistiques")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5174")
public class StatsRestController {

    private final AchatService achatService;
    private final VenteService venteService;

    @GetMapping("/ventes-achats-mensuels")
    public List<MonthStatDto> courbes() {

        Map<String,BigDecimal> aMap = achatService.getAchatsMensuels();
        Map<String, BigDecimal> vMap = venteService.getVentesMensuelles();

        // fusion sur les 12 mois
        return Stream.of(Month.values())                       // java.time.Month
                .map(m -> m.getDisplayName(TextStyle.SHORT, Locale.ENGLISH))  // "Jan"
                .map(mon -> new MonthStatDto(
                        mon,
                        aMap.getOrDefault(mon, BigDecimal.ZERO),
                        vMap.getOrDefault(mon, BigDecimal.ZERO)
                ))
                .collect(Collectors.toList());
    }
}


