package com.example.novera.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.novera.dto.ProductRequest;
import com.example.novera.dto.ProductResponse;
import com.example.novera.entity.Category;
import com.example.novera.entity.Gender;
import com.example.novera.entity.Product;
import com.example.novera.entity.ProductImage;
import com.example.novera.exception.ProductNotFoundException;
import com.example.novera.mapper.ProductMapper;
import com.example.novera.repository.CategoryRepository;
import com.example.novera.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    private final CategoryRepository categoryRepository;
    
    private static final Logger logger = LoggerFactory.getLogger(ProductServiceImpl.class);

    @Override
    public ProductResponse createProduct(ProductRequest request) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .gender(request.getGender())
                .rating(0.0)
                .unitsSold(0)
                .category(category)
                .build();

        if (request.getImageUrls() != null) {

            for (String url : request.getImageUrls()) {

                ProductImage image = ProductImage.builder()
                        .imageUrl(url)
                        .build();

                product.addImage(image);

            }
        }

        Product savedProduct = productRepository.save(product);

        return ProductMapper.toResponse(savedProduct);

    }

    @Override
    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException(id));

        return ProductMapper.toResponse(product);

    }

    @Override
    public ProductResponse updateProduct(Long id,
                                         ProductRequest request) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException(id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        product.setName(request.getName());

        product.setDescription(request.getDescription());

        product.setPrice(request.getPrice());

        product.setStockQuantity(request.getStockQuantity());

        product.setGender(request.getGender());

        product.setCategory(category);

        product.getImages().clear();

        if (request.getImageUrls() != null) {

            for (String url : request.getImageUrls()) {

                ProductImage image = ProductImage.builder()
                        .imageUrl(url)
                        .build();

                product.addImage(image);

            }

        }

        Product updatedProduct = productRepository.save(product);

        return ProductMapper.toResponse(updatedProduct);

    }

    @Override
    public void deleteProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException(id));

        productRepository.delete(product);

    }

    @Override
    public Page<ProductResponse> getAllProducts(
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return productRepository
                .findAll(pageable)
                .map(ProductMapper::toResponse);

    }

    @Override
    public Page<ProductResponse> searchProducts(
            String keyword,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);

        return productRepository
                .findByNameContainingIgnoreCase(keyword, pageable)
                .map(ProductMapper::toResponse);

    }

    @Override
    public Page<ProductResponse> getProductsByGender(
            Gender gender,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);

        return productRepository
                .findByGender(gender, pageable)
                .map(ProductMapper::toResponse);

    }

   @Override
    public Page<ProductResponse> getProductsByCategory(
            Long categoryId,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);

        return productRepository
                .findByCategory_Id(categoryId, pageable)
                .map(ProductMapper::toResponse);

    }

    @Override
        public List<ProductResponse> getProductsByIds(List<Long> ids) {

        List<Product> products = productRepository.findAllById(ids);

        return products.stream()
                .map(ProductMapper::toResponse)
                .toList();
        }

}