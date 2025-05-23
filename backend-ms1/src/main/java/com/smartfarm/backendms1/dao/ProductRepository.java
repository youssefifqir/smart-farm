package com.smartfarm.backendms1.dao;

import com.smartfarm.backendms1.bean.Category;
import com.smartfarm.backendms1.bean.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository  extends JpaRepository<Product, Long> {


    Product findByNom(String nom);


    List<Product> findByCategory(Category category);

    List<Product> findByQuantiteLessThan(int quantiteIsLessThan);

    List<Product> findAllByOrderByPrixAsc();

}
