package com.example.novera.dto;

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
public class VerifyPaymentResponse {

    private Long paymentId;

    private PaymentStatus paymentStatus;

    private String message;

}