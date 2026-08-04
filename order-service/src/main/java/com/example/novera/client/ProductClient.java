package com.example.novera.client;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.novera.dto.external.ProductResponse;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProductClient {

    private final WebClient webClient;

    @Value("${product.service.url}")
    private String productServiceUrl;

    public List<ProductResponse> getProductsByIds(List<Long> productIds) {

    return webClient.post()
            .uri(productServiceUrl + "/api/products/batch")
            .bodyValue(productIds)
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<List<ProductResponse>>() {})
            .block();
}
}