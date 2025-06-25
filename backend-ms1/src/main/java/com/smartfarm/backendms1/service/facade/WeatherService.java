package com.smartfarm.backendms1.service.facade;

import com.fasterxml.jackson.databind.JsonNode;

import com.fasterxml.jackson.databind.JsonNode;
import com.smartfarm.backendms1.record.WeatherData;

public interface WeatherService {
    JsonNode getWeatherForecast(double lat, double lon);
    WeatherData getWeatherForecastAsRecord(double lat, double lon);
    void fetchAndBroadcastWeatherForecast(double lat, double lon);
}