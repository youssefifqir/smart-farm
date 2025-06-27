package com.smartfarm.backendms1.mqtt;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartfarm.backendms1.bean.SensorData;
import com.smartfarm.backendms1.controller.SensorDataWebSocketController;
import com.smartfarm.backendms1.service.facade.SensorDataService;
import jakarta.annotation.PostConstruct;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;


@Component
public class MqttListener {

    //private static final String BROKER_URL = "tcp://mosquitto:1883";
    private static final String BROKER_URL = "tcp://localhost:1883"; // after dockerizing the app, change this to the docker container name -> mosquitto
    private static final String CLIENT_ID = "smart-farm-backend";

    private final SensorDataService sensorDataService;
    private final ObjectMapper objectMapper;
    private final SensorDataWebSocketController sensorDataWebSocketController;

    public MqttListener(SensorDataService sensorDataService, ObjectMapper objectMapper, SensorDataWebSocketController sensorDataWebSocketController) {
        this.sensorDataService = sensorDataService;
        this.objectMapper = objectMapper;
        this.sensorDataWebSocketController = sensorDataWebSocketController;
    }

    @PostConstruct
    public void initMqtt() {
        try {
            MqttClient client = new MqttClient(BROKER_URL, CLIENT_ID, null);
            MqttConnectOptions options = new MqttConnectOptions();
            options.setAutomaticReconnect(true);
            options.setCleanSession(true);
            client.connect(options);

            client.subscribe("farm/sensor", (topic, message) -> {
                String payload = new String(message.getPayload());
                System.out.println("Received message from MQTT: " + payload);

                try {
                    SensorData sensorData = objectMapper.readValue(payload, SensorData.class);
                    sensorData.setTimestamp(LocalDateTime.now());
                    sensorDataService.saveSensorData(sensorData);
                    sensorDataWebSocketController.sendSensorData(sensorData); // sends to frontend ( websockets right after persisting in db louz dakchi)
                } catch (Exception e) {
                    System.err.println("Failed to process payload: " + payload);
                    e.printStackTrace();
                }
            });

            System.out.println("Successfully subscribed to topic farm/sensor");

        } catch (MqttException e) {
            System.err.println("Failed to connect or subscribe to MQTT broker: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
