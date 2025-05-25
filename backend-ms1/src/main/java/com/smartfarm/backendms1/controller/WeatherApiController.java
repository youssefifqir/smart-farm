package com.smartfarm.backendms1.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.smartfarm.backendms1.record.WeatherData;
import com.smartfarm.backendms1.service.facade.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/weather")
public class WeatherApiController {

    private final WeatherService weatherService;


    public WeatherApiController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/forecast")
    public ResponseEntity<JsonNode> getForecast(
            @RequestParam double lat,
            @RequestParam double lon
    ) {
        return ResponseEntity.ok(weatherService.getWeatherForecast(lat, lon));
    }

    @GetMapping("/forecast/record")
    public ResponseEntity<WeatherData> getForecastAsRecord(
            @RequestParam double lat,
            @RequestParam double lon
    ) {
        return ResponseEntity.ok(weatherService.getWeatherForecastAsRecord(lat, lon));
    }

    @PostMapping("/forecast/broadcast")
    public ResponseEntity<String> broadcastForecast(
            @RequestParam double lat,
            @RequestParam double lon
    ) {
        weatherService.fetchAndBroadcastWeatherForecast(lat, lon);
        return ResponseEntity.ok("Weather forecast broadcasted successfully");
    }
}


