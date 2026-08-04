package com.example.novera.service;

import com.example.novera.dto.CreatePaymentRequest;
import com.example.novera.dto.CreatePaymentResponse;
import com.example.novera.dto.PaymentOrderResponse;
import com.example.novera.dto.VerifyPaymentRequest;
import com.example.novera.dto.VerifyPaymentResponse;


public interface PaymentService {

    CreatePaymentResponse createPayment(CreatePaymentRequest request,
                                        Long userId);

    VerifyPaymentResponse verifyPayment(
        VerifyPaymentRequest request,
        Long userId);

}
