package com.smartfarm.backendms1.service.facade;

import java.time.LocalTime;

public interface IrrigationService {
    void startWatering();  // méthode à planifier a 10
     void scheduleWatering(String zone, LocalTime time, int duration);  // 🔁 nouvelle méthode
}
