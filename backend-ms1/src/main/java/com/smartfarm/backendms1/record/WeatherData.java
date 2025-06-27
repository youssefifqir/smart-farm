package com.smartfarm.backendms1.record;

import java.util.List;

public record WeatherData(
        double latitude,
        double longitude,
        String timezone,
        String timezoneAbbreviation,
        DailyUnits dailyUnits,
        Daily daily
) {
    public record DailyUnits(
            String time,
            String temperature2mMax,
            String temperature2mMin,
            String precipitationSum
    ) {}

    public record Daily(
            List<String> time,
            List<Double> temperature2mMax,
            List<Double> temperature2mMin,
            List<Double> precipitationSum
    ) {}
}
