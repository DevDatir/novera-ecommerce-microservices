package com.example.novera.service;

import com.example.novera.dto.AddItemToCartRequest;
import com.example.novera.dto.CartResponse;
import com.example.novera.dto.UpdateCartItemRequest;

public interface CartService {

    CartResponse getCart(Long userId);

    CartResponse addItem(Long userId, AddItemToCartRequest request);

    CartResponse updateItem(Long userId,
                            Long productId,
                            UpdateCartItemRequest request);

    void removeItem(Long userId,
                    Long productId);

    void clearCart(Long userId);

}