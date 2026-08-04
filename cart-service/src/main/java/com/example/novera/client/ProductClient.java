package com.example.novera.client;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.example.novera.dto.ProductResponse;
import com.example.novera.exception.ProductServiceException;

@Component
public class ProductClient {

    private final WebClient webClient;

    @Value("${product.service.url}")
    private String productServiceUrl;

    public ProductClient(WebClient webClient) {
        this.webClient = webClient;
    }

    public List<ProductResponse> getProductsByIds(List<Long> productIds) {

        try {
            return webClient
                    .post()
                    .uri(productServiceUrl + "/api/products/batch")
                    .bodyValue(productIds)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<ProductResponse>>() {})
                    .block();
        } catch (WebClientResponseException.NotFound ex) {
            throw new ProductServiceException(
                    "One or more products were not found.");
        } catch (WebClientResponseException ex) {
            throw new ProductServiceException(
                    "Product service request failed: " + ex.getStatusCode());
        }
    }

    public ProductResponse getProduct(Long productId) {

        try {
            return webClient
                    .get()
                    .uri(productServiceUrl + "/api/products/" + productId)
                    .retrieve()
                    .bodyToMono(ProductResponse.class)
                    .block();
        } catch (WebClientResponseException.NotFound ex) {
            throw new ProductServiceException(
                    "Product not found with id: " + productId);
        } catch (WebClientResponseException ex) {
            throw new ProductServiceException(
                    "Product service request failed: " + ex.getStatusCode());
        }
    }
}