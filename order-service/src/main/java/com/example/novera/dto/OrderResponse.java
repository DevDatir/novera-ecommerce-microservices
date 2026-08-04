package com.example.novera.dto;

import com.example.novera.enums.OrderStatus;
import com.example.novera.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {

    private Long id;

    private OrderStatus orderStatus;

    private PaymentStatus paymentStatus;

    private BigDecimal totalAmount;

    private LocalDateTime createdAt;

    private ShippingAddressResponse shippingAddress;

    private List<OrderItemResponse> items;
}