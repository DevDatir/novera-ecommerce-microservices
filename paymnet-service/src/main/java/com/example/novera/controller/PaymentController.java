package com.example.novera.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.novera.dto.CreatePaymentRequest;
import com.example.novera.dto.CreatePaymentResponse;
import com.example.novera.dto.VerifyPaymentRequest;
import com.example.novera.dto.VerifyPaymentResponse;
import com.example.novera.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<CreatePaymentResponse> createPayment(
            @Valid @RequestBody CreatePaymentRequest request,
            @RequestHeader("X-User-Id") Long userId) {

        return ResponseEntity.ok(
                paymentService.createPayment(request, userId)
        );
    }

    @PostMapping("/verify")
    public ResponseEntity<VerifyPaymentResponse> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request,
            @RequestHeader("X-User-Id") Long userId) {

        return ResponseEntity.ok(
                paymentService.verifyPayment(request, userId)
        );
    }
   

    // @GetMapping("/internal/{id}")
    // public ResponseEntity<PaymentOrderResponse> getOrderForPayment(
    //         @PathVariable Long id) {

    //     return ResponseEntity.ok(paymentService.getOrderForPayment(id));
    // }

}
