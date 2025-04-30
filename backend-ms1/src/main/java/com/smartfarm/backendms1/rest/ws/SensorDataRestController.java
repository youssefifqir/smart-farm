package com.smartfarm.backendms1.rest.ws;

import com.smartfarm.backendms1.dao.SensorRepository;
import com.smartfarm.backendms1.rest.converter.SensorDataConverter;
import com.smartfarm.backendms1.rest.dto.SensorDataDto;
import com.smartfarm.backendms1.service.facade.SensorDataService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/v1/sensor-data")
public class SensorDataRestController {
    private final SensorDataService sensorDataService;
    private final SensorDataConverter sensorDataConverter;


    public SensorDataRestController(SensorDataService sensorDataService, SensorDataConverter sensorDataConverter) {
        this.sensorDataService = sensorDataService;
        this.sensorDataConverter = sensorDataConverter;
    }

    @PostMapping("/sensor-data")
    public ResponseEntity<Void> saveSensorData(@RequestBody SensorDataDto dto) {
        try {
            var data = sensorDataConverter.toItem(dto);
            sensorDataService.saveSensorData(data);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // 400 : bad input
        } catch (NullPointerException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // 400 missing required data
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 500 : internal server error
        }
    }

}
