package com.example.novera.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.novera.dto.external.CartResponse;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CartClient {

    private final WebClient webClient;

    @Value("${cart.service.url}")
    private String cartServiceUrl;

    public CartResponse getCart(String bearerToken, Long userId) {

        return webClient.get()
                .uri(cartServiceUrl + "/api/cart")
                .header(HttpHeaders.AUTHORIZATION, bearerToken)
                .header("X-User-Id", userId.toString())
                .retrieve()
                .bodyToMono(CartResponse.class)
                .block();
    }

    public void clearCart(String bearerToken, Long userId) {

        webClient.delete()
                .uri(cartServiceUrl + "/api/cart/clear")
                .header(HttpHeaders.AUTHORIZATION, bearerToken)
                .header("X-User-Id", userId.toString())
                .retrieve()
                .toBodilessEntity()
                .block();
    }
}
