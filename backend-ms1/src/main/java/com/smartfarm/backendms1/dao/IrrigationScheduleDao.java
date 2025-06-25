package com.smartfarm.backendms1.dao;

import com.smartfarm.backendms1.bean.IrrigationSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalTime;
import java.util.List;

public interface IrrigationScheduleDao extends JpaRepository<IrrigationSchedule, Long> {
    List<IrrigationSchedule> findByTimeBetween(LocalTime start, LocalTime end);

}
