package com.example.novera.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class OrderItemResponse {

    private Long productId;

    private String productName;

    private Integer quantity;

    private BigDecimal priceAtPurchase;
    
    private List<String> imageUrls;

    private BigDecimal subtotal;
}