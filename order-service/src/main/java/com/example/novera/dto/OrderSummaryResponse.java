package com.example.novera.dto;

import com.example.novera.enums.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class OrderSummaryResponse {

    private Long id;

    private OrderStatus orderStatus;

    private BigDecimal totalAmount;

    private LocalDateTime createdAt;
}