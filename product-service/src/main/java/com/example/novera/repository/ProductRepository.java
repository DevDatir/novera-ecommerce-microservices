package com.example.novera.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.novera.entity.Gender;
import com.example.novera.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

    Page<Product> findByGender(Gender gender, Pageable pageable);

    Page<Product> findByCategory_Id(Long categoryId, Pageable pageable);

    List<Product> findAllById(Iterable<Long> ids);
}
