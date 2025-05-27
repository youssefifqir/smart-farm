package com.smartfarm.backendms1.controller;


import com.smartfarm.backendms1.record.WeatherData;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WeatherWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendWeatherForecast(WeatherData weatherData) {
        System.out.println("Sending weather forecast via WebSocket: " + weatherData);
        messagingTemplate.convertAndSend("/topic/weather-forecast", weatherData);
    }
}