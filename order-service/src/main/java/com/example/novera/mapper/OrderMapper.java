package com.example.novera.mapper;

import com.example.novera.dto.OrderSummaryResponse;
import com.example.novera.entity.OrderEntity;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public OrderSummaryResponse toSummaryResponse(OrderEntity order) {

        return OrderSummaryResponse.builder()
                .id(order.getId())
                .orderStatus(order.getOrderStatus())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .build();
    }
}