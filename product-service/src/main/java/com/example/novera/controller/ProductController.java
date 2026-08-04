package com.example.novera.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.novera.dto.ProductRequest;
import com.example.novera.dto.ProductResponse;
import com.example.novera.entity.Gender;
import com.example.novera.service.ProductService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ProductResponse createProduct(
            @Valid @RequestBody ProductRequest request) {

        return productService.createProduct(request);
    }

    @GetMapping("/{id}")
    public ProductResponse getProductById(
            @PathVariable Long id) {

        return productService.getProductById(id);
    }

    @PostMapping("/batch")
    public List<ProductResponse> getProductsByIds(
            @RequestBody List<Long> productIds) {

        return productService.getProductsByIds(productIds);
    }

    @GetMapping
    public Page<ProductResponse> getAllProducts(

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "id") String sortBy,

            @RequestParam(defaultValue = "asc") String direction) {

        return productService.getAllProducts(
                page,
                size,
                sortBy,
                direction
        );
    }

    @GetMapping("/search")
    public Page<ProductResponse> searchProducts(

            @RequestParam String keyword,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size) {

        return productService.searchProducts(
                keyword,
                page,
                size
        );
    }

    @GetMapping("/gender/{gender}")
    public Page<ProductResponse> getProductsByGender(

            @PathVariable Gender gender,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size) {

        return productService.getProductsByGender(
                gender,
                page,
                size
        );
    }

    @GetMapping("/category/{categoryId}")
    public Page<ProductResponse> getProductsByCategory(

            @PathVariable Long categoryId,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size) {

        return productService.getProductsByCategory(
                categoryId,
                page,
                size
        );
    }

    @PutMapping("/{id}")
    public ProductResponse updateProduct(

            @PathVariable Long id,

            @Valid @RequestBody ProductRequest request) {

        return productService.updateProduct(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(
            @PathVariable Long id) {

        productService.deleteProduct(id);
    }


}
