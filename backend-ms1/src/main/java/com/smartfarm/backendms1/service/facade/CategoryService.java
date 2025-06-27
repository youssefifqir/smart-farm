package com.smartfarm.backendms1.service.facade;

import com.smartfarm.backendms1.bean.Category;
import com.smartfarm.backendms1.bean.Product;

import java.util.List;

public interface CategoryService {
    public int save(Category category);



    List<Category> findAll();

    Category findById(Long id);

    boolean deleteById(Long id);
}
