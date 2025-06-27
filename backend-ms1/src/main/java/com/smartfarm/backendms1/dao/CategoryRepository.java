package com.smartfarm.backendms1.dao;

import com.smartfarm.backendms1.bean.Category;
import com.smartfarm.backendms1.bean.Product;
import com.smartfarm.backendms1.bean.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CategoryRepository  extends JpaRepository<Category, Long> {

    List<Category> findByZone(Zone zone);

    Category findByNom(String nom);

}
