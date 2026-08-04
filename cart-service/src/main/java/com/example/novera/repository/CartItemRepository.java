package com.example.novera.repository;

import java.util.List;

import com.example.novera.entity.Cart;
import com.example.novera.entity.CartItem;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByCartAndProductId(Cart cart, Long productId);

    public List<CartItem> findAllByCart(Cart cart);
}