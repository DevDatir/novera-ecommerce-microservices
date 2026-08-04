package com.example.novera.service;

import java.math.BigDecimal;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.novera.client.OrderClient;
import com.example.novera.dto.CreatePaymentRequest;
import com.example.novera.dto.CreatePaymentResponse;
import com.example.novera.dto.PaymentOrderResponse;
import com.example.novera.dto.VerifyPaymentRequest;
import com.example.novera.dto.VerifyPaymentResponse;
import com.example.novera.entity.Payment;
import com.example.novera.enums.PaymentProvider;
import com.example.novera.enums.PaymentStatus;
import com.example.novera.exception.InvalidPaymentSignatureException;
import com.example.novera.exception.PaymentNotFoundException;
import com.example.novera.exception.RazorpayPaymentException;
import com.example.novera.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    private final RazorpayClient razorpayClient;

    private final OrderClient orderClient;

    @Value("${razorpay.key.id}")
    private String razorpayKey;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    private static final Logger logger =
        LoggerFactory.getLogger(PaymentServiceImpl.class);

    @Override
    @Transactional
    public CreatePaymentResponse createPayment(CreatePaymentRequest request,
            Long userId) {

        PaymentOrderResponse order = fetchOrder(request, userId);

        Order razorpayOrder = createRazorpayOrder(order);

        Payment payment = buildPayment(order, razorpayOrder);

        paymentRepository.save(payment);

        return buildResponse(payment);

    }

    private void verifySignature(
            VerifyPaymentRequest request) {

        try {

            JSONObject options = new JSONObject();

            options.put(
                    "razorpay_order_id",
                    request.getRazorpayOrderId()
            );

            options.put(
                    "razorpay_payment_id",
                    request.getRazorpayPaymentId()
            );

            options.put(
                    "razorpay_signature",
                    request.getRazorpaySignature()
            );

            boolean valid
                    = Utils.verifyPaymentSignature(
                            options,
                            razorpayKeySecret
                    );

            if (!valid) {
                throw new InvalidPaymentSignatureException(
                        "Payment signature verification failed."
                );
            }

        } catch (Exception e) {

            throw new RazorpayPaymentException(
                    "Unable to verify payment.",
                    e
            );

        }

    }

    @Override
    @Transactional
    public VerifyPaymentResponse verifyPayment(
            VerifyPaymentRequest request,
            Long userId) {

        verifySignature(request);

        Payment payment = getPayment(request);

        if (!payment.getUserId().equals(userId)) {
            throw new PaymentNotFoundException("Payment not found.");
        }

        updatePayment(payment, request);

        orderClient.markPaymentSuccess(
                payment.getOrderId(), userId
        );

        return buildVerifyResponse(payment);

    }

    private PaymentOrderResponse fetchOrder(CreatePaymentRequest request,
            Long userId) {

        return orderClient.getOrder(
                request.getOrderId(),
                userId
        );

    }

    private Order createRazorpayOrder(PaymentOrderResponse order) {

        try {

            JSONObject options = new JSONObject();

            options.put(
                    "amount",
                    convertToPaise(order.getTotalAmount())
            );

            options.put("currency", "INR");

            options.put(
                    "receipt",
                    "order_" + order.getId()
            );

            return razorpayClient.orders.create(options);

        } catch (Exception e) {

            throw new RuntimeException(e);

        }

    }

    private Payment buildPayment(PaymentOrderResponse order,
            Order razorpayOrder) {

        return Payment.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .amount(order.getTotalAmount())
                .paymentProvider(PaymentProvider.RAZORPAY)
                .providerOrderId(
                        razorpayOrder.get("id")
                )
                .status(PaymentStatus.PENDING)
                .build();

    }

    private CreatePaymentResponse buildResponse(
            Payment payment
    ) {

        return CreatePaymentResponse.builder()
                .paymentId(payment.getId())
                .razorpayOrderId(
                        payment.getProviderOrderId()
                )
                .razorpayKey(razorpayKey)
                .currency("INR")
                .amount(
                        convertToPaise(
                                payment.getAmount()
                        )
                )
                .build();

    }

    private Long convertToPaise(BigDecimal amount) {

        return amount
                .multiply(BigDecimal.valueOf(100))
                .longValue();

    }

    private Payment getPayment(
            VerifyPaymentRequest request
    ) {

        return paymentRepository
                .findByProviderOrderId(
                        request.getRazorpayOrderId()
                )
                .orElseThrow(
                        () -> new PaymentNotFoundException(
                                "Payment not found."
                        )
                );

    }

    private void updatePayment(
            Payment payment,
            VerifyPaymentRequest request
    ) {

        payment.setProviderPaymentId(
                request.getRazorpayPaymentId()
        );

        payment.setProviderSignature(
                request.getRazorpaySignature()
        );

        payment.setStatus(
                PaymentStatus.SUCCESS
        );

    }

    private VerifyPaymentResponse buildVerifyResponse(
            Payment payment
    ) {

        return VerifyPaymentResponse.builder()
                .paymentId(payment.getId())
                .paymentStatus(payment.getStatus())
                .message("Payment verified successfully.")
                .build();

    }

}
