package com.example.novera.exception;

public class RazorpayPaymentException extends RuntimeException {

    public RazorpayPaymentException(String msg, Exception e) {
        super(msg);
    }

}