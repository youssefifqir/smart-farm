package com.smartfarm.backendms1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // 🔁 Active la planification des tâches
public class BackendMs1Application {

    public static void main(String[] args) {
        SpringApplication.run(BackendMs1Application.class, args);
    }

}
