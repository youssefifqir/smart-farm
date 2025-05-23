package com.smartfarm.backendms1.dao;

import com.smartfarm.backendms1.bean.Category;
import com.smartfarm.backendms1.bean.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface CategoryRepository  extends JpaRepository<Category, Long> {


    Category findByNom(String nom);

}
