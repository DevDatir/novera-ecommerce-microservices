package com.example.novera.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.example.novera.dto.ProductRequest;
import com.example.novera.dto.ProductResponse;
import com.example.novera.entity.Gender;

public interface ProductService {

    ProductResponse createProduct(ProductRequest request);

    ProductResponse getProductById(Long id);

    Page<ProductResponse> getAllProducts(
            int page,
            int size,
            String sortBy,
            String direction
    );

    Page<ProductResponse> searchProducts(
            String keyword,
            int page,
            int size
    );

    Page<ProductResponse> getProductsByGender(
            Gender gender,
            int page,
            int size
    );

    Page<ProductResponse> getProductsByCategory(
            Long categoryId,
            int page,
            int size
    );

    ProductResponse updateProduct(Long id,
                                  ProductRequest request);

    void deleteProduct(Long id);

    List<ProductResponse> getProductsByIds(List<Long> ids);

}