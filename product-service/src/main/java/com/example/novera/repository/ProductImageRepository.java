package com.example.novera.repository;

import  com.example.novera.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository
        extends JpaRepository<ProductImage, Long> {

}