package com.example.novera.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.novera.dto.OrderResponse;
import com.example.novera.dto.OrderSummaryResponse;
import com.example.novera.dto.PlaceOrderRequest;
import com.example.novera.dto.external.PaymentOrderResponse;
import com.example.novera.service.OrderService;

import jakarta.servlet.http.HttpServletRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public OrderResponse placeOrder(
            HttpServletRequest request,
            @RequestHeader("Authorization") String bearerToken,
            @Valid @RequestBody PlaceOrderRequest body) {

        Long userId = Long.parseLong(request.getHeader("X-User-Id"));
        return orderService.placeOrder(userId,bearerToken,body);
    }

    @GetMapping
    public Page<OrderSummaryResponse> getOrders(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Long userId = Long.parseLong(request.getHeader("X-User-Id"));
        return orderService.getOrders(
                userId,
                PageRequest.of(
                        page,
                        size,
                        Sort.by("createdAt").descending()
                )
        );
    }

    @GetMapping("/{orderId}")
    public OrderResponse getOrder(
            HttpServletRequest request,
            @PathVariable Long orderId) {

        Long userId = Long.parseLong(request.getHeader("X-User-Id"));
        return orderService.getOrder(userId,orderId);
    }

    @PutMapping("/{orderId}/cancel")
    public OrderResponse cancelOrder(
            HttpServletRequest request,
            @PathVariable Long orderId) {

        Long userId = Long.parseLong(request.getHeader("X-User-Id"));
        return orderService.cancelOrder(userId,orderId);
    }

    @GetMapping("/internal/{orderId}")
    public ResponseEntity<PaymentOrderResponse> getOrderForPayment(
            @PathVariable Long orderId,
            HttpServletRequest request) {

        Long userId = Long.parseLong(request.getHeader("X-User-Id"));

        return ResponseEntity.ok(
                orderService.getOrderForPayment(orderId, userId)
        );
    }

    @PutMapping("/internal/{orderId}/payment-success")
    public ResponseEntity<Void> markPaymentSuccess(
            @PathVariable Long orderId,
            HttpServletRequest request) {

        Long userId = Long.parseLong(request.getHeader("X-User-Id"));

        orderService.markPaymentSuccess(orderId, userId);

        return ResponseEntity.ok().build();
    }
}
