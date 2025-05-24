package com.smartfarm.backendms1.service.impl;

import com.smartfarm.backendms1.bean.SensorData;
import com.smartfarm.backendms1.service.facade.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AlertServiceImpl implements AlertService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void check(SensorData sensorData) {
        if (Boolean.TRUE.equals(sensorData.getIsFire())) {
            Map<String, Object> msg = new HashMap<>();
            msg.put("type", "FIRE");
            msg.put("message", "🔥 Incendie détecté !");
            msg.put("timestamp", sensorData.getTimestamp());
            messagingTemplate.convertAndSend("/topic/alerts", msg);
        }

        if (Boolean.TRUE.equals(sensorData.getIsRaining())) {
            Map<String, Object> msg = new HashMap<>();
            msg.put("type", "RAIN");
            msg.put("message", "🌧️ Pluie détectée !");
            msg.put("timestamp", sensorData.getTimestamp());
            messagingTemplate.convertAndSend("/topic/alerts", msg);
        }
    }
}



