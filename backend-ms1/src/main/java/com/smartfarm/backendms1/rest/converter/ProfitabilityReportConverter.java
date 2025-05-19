package com.smartfarm.backendms1.rest.converter;

import com.smartfarm.backendms1.bean.ProfitabilityReport;
import com.smartfarm.backendms1.rest.dto.ProfitabilityReportDto;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class ProfitabilityReportConverter {

    public ProfitabilityReport toItem(ProfitabilityReportDto dto) {
        if (dto == null) {
            return null;
        } else {
            ProfitabilityReport item = new ProfitabilityReport();
            item.setDate(dto.getDate() != null ? dto.getDate() : LocalDate.now());
            item.setWaterCost(dto.getWaterCost());
            item.setEnergyCost(dto.getEnergyCost());
            item.setSensorMaintenanceCost(dto.getSensorMaintenanceCost());
            item.setTotalCost(dto.getTotalCost());
            item.setEstimatedRevenue(dto.getEstimatedRevenue());
            item.setProfit(dto.getProfit());
            item.setProfitMargin(dto.getProfitMargin());  // Ajout de profitMargin
            item.setTimeframe(dto.getTimeframe());        // Ajout de timeframe
            item.setCropType(dto.getCropType());          // Ajout de cropType (Enum)
            item.setZone(dto.getZone());                  // Ajout de zone (Enum)
            item.setLaborCost(dto.getLaborCost());        // Ajout de laborCost
            item.setFertilizerCost(dto.getFertilizerCost());  // Ajout de fertilizerCost
            item.setOtherCosts(dto.getOtherCosts());      // Ajout de otherCosts
            item.setYieldAmount(dto.getYieldAmount());    // Ajout de yieldAmount
            return item;
        }
    }

    public ProfitabilityReportDto toDto(ProfitabilityReport item) {
        if (item == null) {
            return null;
        } else {
            ProfitabilityReportDto dto = new ProfitabilityReportDto();
            dto.setDate(item.getDate());
            dto.setWaterCost(item.getWaterCost());
            dto.setEnergyCost(item.getEnergyCost());
            dto.setSensorMaintenanceCost(item.getSensorMaintenanceCost());
            dto.setTotalCost(item.getTotalCost());
            dto.setEstimatedRevenue(item.getEstimatedRevenue());
            dto.setProfit(item.getProfit());
            dto.setProfitMargin(item.getProfitMargin());  // Ajout de profitMargin
            dto.setTimeframe(item.getTimeframe());        // Ajout de timeframe
            dto.setCropType(item.getCropType());          // Ajout de cropType (Enum)
            dto.setZone(item.getZone());                  // Ajout de zone (Enum)
            dto.setLaborCost(item.getLaborCost());        // Ajout de laborCost
            dto.setFertilizerCost(item.getFertilizerCost());  // Ajout de fertilizerCost
            dto.setOtherCosts(item.getOtherCosts());      // Ajout de otherCosts
            dto.setYieldAmount(item.getYieldAmount());    // Ajout de yieldAmount
            return dto;
        }
    }

    public List<ProfitabilityReport> toItems(List<ProfitabilityReportDto> dtos) {
        List<ProfitabilityReport> items = new ArrayList<>();
        if (dtos != null && !dtos.isEmpty()) {
            for (ProfitabilityReportDto dto : dtos) {
                items.add(toItem(dto));
            }
        }
        return items;
    }

    public List<ProfitabilityReportDto> toDtos(List<ProfitabilityReport> items) {
        List<ProfitabilityReportDto> dtos = new ArrayList<>();
        if (items != null && !items.isEmpty()) {
            for (ProfitabilityReport item : items) {
                dtos.add(toDto(item));
            }
        }
        return dtos;
    }
}
