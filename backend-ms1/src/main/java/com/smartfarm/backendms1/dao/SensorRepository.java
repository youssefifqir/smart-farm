package com.smartfarm.backendms1.dao;

import com.smartfarm.backendms1.bean.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SensorRepository extends JpaRepository<SensorData, Long> {
    SensorData findByTimestamp(LocalDateTime timestamp);

    List<SensorData> findByTimestampBetween(LocalDateTime start, LocalDateTime end); //ila bghina infos mabin deux dates -> bach ndiro graphs

    List<SensorData> findByIsRainingTrue(); // dates li kant chta

    List<SensorData> findByIsFireTrue(); //dates li kano fihum des incendies

    SensorData findTopByOrderByTimestampDesc(); //akhir info tsauvgardat

    //avg dial temperature f chi moda mo3ayana
    @Query("SELECT AVG(s.temperature) FROM SensorData s WHERE s.timestamp BETWEEN :start AND :end")
    Double findAverageTemperatureBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);


}
