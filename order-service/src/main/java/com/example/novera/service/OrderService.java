package com.example.novera.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.novera.dto.OrderResponse;
import com.example.novera.dto.OrderSummaryResponse;
import com.example.novera.dto.PlaceOrderRequest;
import com.example.novera.dto.external.PaymentOrderResponse;

public interface OrderService {

    OrderResponse placeOrder(Long userId,
                             String bearerToken,
                             PlaceOrderRequest request);

    Page<OrderSummaryResponse> getOrders(Long userId,
                                         Pageable pageable);

    OrderResponse getOrder(Long userId,
                           Long orderId);

    OrderResponse cancelOrder(Long userId,
                              Long orderId);

    PaymentOrderResponse getOrderForPayment(Long orderId, Long userId);

    void markPaymentSuccess(Long orderId, Long userId);
}