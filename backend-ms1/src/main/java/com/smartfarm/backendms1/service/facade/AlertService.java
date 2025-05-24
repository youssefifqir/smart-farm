package com.smartfarm.backendms1.service.facade;

import com.smartfarm.backendms1.bean.SensorData;

public interface AlertService {
    void check(SensorData sensorData);

}
