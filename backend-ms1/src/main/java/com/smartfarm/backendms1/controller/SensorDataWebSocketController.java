package com.smartfarm.backendms1.controller;


import com.smartfarm.backendms1.bean.SensorData;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class SensorDataWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendSensorData(SensorData sensorData) {
        System.out.println("Sending sensor data via WebSocket: " + sensorData);
        messagingTemplate.convertAndSend("/topic/sensor-data", sensorData);
    }
}
