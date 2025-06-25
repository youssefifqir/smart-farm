package com.smartfarm.backendms1.rest.dto;

public class IrrigationScheduleRequest {
    private String zone;
    private String time;     // Exemple : "08:30"
    private int duration;    // Durée en minutes

    public IrrigationScheduleRequest() {}

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }
}
