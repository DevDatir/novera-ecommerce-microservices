package com.example.novera.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.novera.dto.PaymentOrderResponse;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OrderClient {

    private final WebClient webClient;

    @Value("${order.service.url}")
    private String orderServiceUrl;

    public PaymentOrderResponse getOrder(Long orderId, Long userId) {

        return webClient
                .get()
                .uri(orderServiceUrl + "/api/orders/internal/" + orderId)
                .header("X-User-Id", userId.toString())
                .retrieve()
                .bodyToMono(PaymentOrderResponse.class)
                .block();

    }

    public void markPaymentSuccess(Long orderId, Long userId) {

        webClient
                .put()
                .uri(orderServiceUrl + "/api/orders/internal/" + orderId + "/payment-success")
                .header("X-User-Id", userId.toString())
                .retrieve()
                .toBodilessEntity()
                .block();

    }

}
