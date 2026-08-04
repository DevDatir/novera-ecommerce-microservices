package com.example.novera.mapper;

import com.example.novera.dto.ProductResponse;
import com.example.novera.entity.Product;

import java.util.stream.Collectors;

public class ProductMapper {

    private ProductMapper() {
    }

    public static ProductResponse toResponse(Product product) {

        if (product == null) {
            return null;
        }

        ProductResponse response = new ProductResponse();

        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStockQuantity(product.getStockQuantity());
        response.setRating(product.getRating());
        response.setUnitsSold(product.getUnitsSold());
        response.setGender(product.getGender());

        if (product.getCategory() != null) {
            response.setCategory(product.getCategory().getName());
        }

        if (product.getImages() != null) {
            response.setImageUrls(
                    product.getImages()
                            .stream()
                            .map(image -> image.getImageUrl())
                            .collect(Collectors.toList())
            );
        }

        return response;
    }

}