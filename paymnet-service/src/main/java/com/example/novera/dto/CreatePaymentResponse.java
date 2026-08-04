package com.example.novera.dto;

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
public class CreatePaymentResponse {

    private String razorpayOrderId;

    private String razorpayKey;

    private Long paymentId;

    private String currency;

    private Long amount;

}