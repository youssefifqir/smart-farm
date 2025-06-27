package com.smartfarm.backendms1.dao;

import com.smartfarm.backendms1.bean.Category;
import com.smartfarm.backendms1.bean.Product;
import com.smartfarm.backendms1.bean.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository  extends JpaRepository<Product, Long> {


    Product findByNom(String nom);

    List<Product> findByCategoryIn(List<Category> categories);
    List<Product> findByCategory_Zone(Zone zone);

    List<Product> findByCategory(Category category);

    List<Product> findByQuantiteLessThan(int quantiteIsLessThan);

    List<Product> findAllByOrderByPrixAsc();

}
