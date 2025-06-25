package com.smartfarm.backendms1.bean;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
public class IrrigationSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String zone;
    private LocalTime time;
    private int duration;
    private boolean executed = false;

    public Long getId() { return id; }

    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }

    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }

    public boolean isExecuted() { return executed; }
    public void setExecuted(boolean executed) { this.executed = executed; }
}
