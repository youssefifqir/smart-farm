package com.smartfarm.backendms1.service.impl;

import com.smartfarm.backendms1.service.facade.IrrigationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class IrrigationServiceImpl implements IrrigationService {

    @Override
    @Scheduled(cron = "0 0 10 * * ?") // Tous les jours à 10h
    public void startWatering() {
        System.out.println("✅ Arrosage automatique lancé à 10h !");
        // Ici, tu peux appeler l'actionneur ou enregistrer une commande dans la base
    }
}
