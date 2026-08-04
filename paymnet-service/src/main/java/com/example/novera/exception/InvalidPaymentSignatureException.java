package com.example.novera.exception;

public class InvalidPaymentSignatureException extends RuntimeException{

    public InvalidPaymentSignatureException(String msg){
        super(msg);
    }
    
}
