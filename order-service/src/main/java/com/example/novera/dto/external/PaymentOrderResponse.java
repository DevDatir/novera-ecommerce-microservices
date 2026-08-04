package com.example.novera.dto.external;

import java.math.BigDecimal;

import com.example.novera.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOrderResponse {

    private Long id;
    private Long userId;
    private BigDecimal totalAmount;
    private PaymentStatus paymentStatus;

}