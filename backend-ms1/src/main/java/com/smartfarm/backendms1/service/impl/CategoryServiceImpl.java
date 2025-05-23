package com.smartfarm.backendms1.service.impl;

import com.smartfarm.backendms1.bean.Category;
import com.smartfarm.backendms1.bean.Product;
import com.smartfarm.backendms1.dao.CategoryRepository;
import com.smartfarm.backendms1.service.facade.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;



    @Override
    public int save(Category category) {
        try {
            categoryRepository.save(category);
            return 1; // success
        } catch (Exception e) {
            e.printStackTrace();
            return 0; // failure
        }
    }



    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category findById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    @Override
    public boolean deleteById(Long id) {
        categoryRepository.deleteById(id);
        return false;
    }
}
