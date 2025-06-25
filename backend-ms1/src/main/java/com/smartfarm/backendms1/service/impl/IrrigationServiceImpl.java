package com.smartfarm.backendms1.service.impl;

import com.smartfarm.backendms1.bean.IrrigationSchedule;
import com.smartfarm.backendms1.dao.IrrigationScheduleDao;
import com.smartfarm.backendms1.service.facade.IrrigationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

@Service
public class IrrigationServiceImpl implements IrrigationService {

    @Autowired
    private IrrigationScheduleDao scheduleDao;

    // ✅ Arrosage manuel
    @Override
    public void startWatering() {
        System.out.println("✅ Arrosage manuel déclenché !");
        //  Ajoute ici ton appel à l’actionneur si nécessaire
    }

    // ✅ Planification dynamique avec stockage en base
  @Override
public void scheduleWatering(String zone, LocalTime time, int duration) {
    IrrigationSchedule task = new IrrigationSchedule();
    task.setZone(zone);
    task.setTime(LocalTime.of(time.getHour(), time.getMinute())); // seconds et nanos = 0
    task.setDuration(duration);
    task.setExecuted(false);
    scheduleDao.save(task);

    System.out.println("📅 Tâche enregistrée : " + task.getZone() + " à " + task.getTime());
}

    // ✅ Déclenche les arrosages au bon moment
  @Scheduled(fixedRate = 60000)
public void checkAndTriggerIrrigation() {
    LocalTime now = LocalTime.now().withSecond(0).withNano(0);
    LocalTime next = now.plusMinutes(1);

    System.out.println("🛠️ [DEBUG] Vérification entre : " + now + " et " + next);

    List<IrrigationSchedule> tasks = scheduleDao.findByTimeBetween(now, next);
    System.out.println("📦 [DEBUG] Tâches trouvées : " + tasks.size());

    for (IrrigationSchedule task : tasks) {
        System.out.println("➡️ [DEBUG] Tâche : " + task.getZone() + " à " + task.getTime());

        if (!task.isExecuted()) {
            System.out.println("🚿 ARROSAGE :  " + task.getZone() + " pendant " + task.getDuration() + " min");

            task.setExecuted(true);
            scheduleDao.save(task);
        } else {
            System.out.println("⏭️ Déjà exécutée");
        }
    }
}

}
