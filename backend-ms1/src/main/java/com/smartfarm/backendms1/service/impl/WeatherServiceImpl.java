package com.smartfarm.backendms1.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.smartfarm.backendms1.controller.WeatherWebSocketController;
import com.smartfarm.backendms1.record.WeatherData;
import com.smartfarm.backendms1.service.facade.WeatherService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WeatherServiceImpl implements WeatherService {

    @Value("${openweather.api.key}")
    private String apiKey;

    // Default coordinates for your farm location
    @Value("${weather.default.latitude:35.75}")
    private double defaultLatitude;

    @Value("${weather.default.longitude:-5.8125}")
    private double defaultLongitude;

    private final RestTemplate restTemplate = new RestTemplate();
    private final WeatherWebSocketController weatherWebSocketController;

    @Override
    public JsonNode getWeatherForecast(double lat, double lon) {
        String url = String.format(
                "https://api.open-meteo.com/v1/forecast?latitude=%s&longitude=%s&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto",
                lat, lon
        );

        ResponseEntity<JsonNode> response = restTemplate.getForEntity(url, JsonNode.class);
        return response.getBody();
    }

    @Override
    public WeatherData getWeatherForecastAsRecord(double lat, double lon) {
        try {
            JsonNode jsonResponse = getWeatherForecast(lat, lon);
            return parseJsonToWeatherData(jsonResponse);
        } catch (Exception e) {
            log.error("Error parsing weather data to record: {}", e.getMessage(), e);
            return null;
        }
    }

    @Override
    public void fetchAndBroadcastWeatherForecast(double lat, double lon) {
        try {
            WeatherData weatherData = getWeatherForecastAsRecord(lat, lon);
            if (weatherData != null) {
                weatherWebSocketController.sendWeatherForecast(weatherData);
                log.info("Weather forecast broadcasted successfully for lat: {}, lon: {}", lat, lon);
            }
        } catch (Exception e) {
            log.error("Error broadcasting weather forecast: {}", e.getMessage(), e);
        }
    }

    // This method runs automatically every hour
    @Scheduled(fixedRate = 3000) // 3600000 ms = 1 hour
    public void scheduledWeatherBroadcast() {
        log.info("Starting scheduled weather forecast broadcast");
        fetchAndBroadcastWeatherForecast(defaultLatitude, defaultLongitude);
    }

    // Optional: Broadcast weather at specific times (e.g., every day at 6 AM and 6 PM)
    @Scheduled(cron = "0 0 6,18 * * ?") // At 6:00 AM and 6:00 PM every day
    public void scheduledDailyWeatherBroadcast() {
        log.info("Starting daily weather forecast broadcast");
        fetchAndBroadcastWeatherForecast(defaultLatitude, defaultLongitude);
    }

    private WeatherData parseJsonToWeatherData(JsonNode jsonNode) {
        // Parse daily units
        JsonNode dailyUnitsNode = jsonNode.get("daily_units");
        WeatherData.DailyUnits dailyUnits = new WeatherData.DailyUnits(
                dailyUnitsNode.get("time").asText(),
                dailyUnitsNode.get("temperature_2m_max").asText(),
                dailyUnitsNode.get("temperature_2m_min").asText(),
                dailyUnitsNode.get("precipitation_sum").asText()
        );

        // Parse daily data
        JsonNode dailyNode = jsonNode.get("daily");

        List<String> timeList = new ArrayList<>();
        dailyNode.get("time").forEach(node -> timeList.add(node.asText()));

        List<Double> tempMaxList = new ArrayList<>();
        dailyNode.get("temperature_2m_max").forEach(node -> tempMaxList.add(node.asDouble()));

        List<Double> tempMinList = new ArrayList<>();
        dailyNode.get("temperature_2m_min").forEach(node -> tempMinList.add(node.asDouble()));

        List<Double> precipitationList = new ArrayList<>();
        dailyNode.get("precipitation_sum").forEach(node -> precipitationList.add(node.asDouble()));

        WeatherData.Daily daily = new WeatherData.Daily(
                timeList,
                tempMaxList,
                tempMinList,
                precipitationList
        );

        return new WeatherData(
                jsonNode.get("latitude").asDouble(),
                jsonNode.get("longitude").asDouble(),
                jsonNode.get("timezone").asText(),
                jsonNode.get("timezone_abbreviation").asText(),
                dailyUnits,
                daily
        );
    }
}
