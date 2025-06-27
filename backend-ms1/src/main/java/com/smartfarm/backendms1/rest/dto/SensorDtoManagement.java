package com.smartfarm.backendms1.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SensorDtoManagement {
    private Long id;
    private String name;
    private String type;
    private Boolean isActive;
    private String location;
}
