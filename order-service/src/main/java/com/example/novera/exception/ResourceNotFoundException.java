package com.example.novera.exception;


public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String order_not_found) {
        super(order_not_found);
    }

}
