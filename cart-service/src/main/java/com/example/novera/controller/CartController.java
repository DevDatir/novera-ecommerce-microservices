package com.example.novera.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.novera.dto.AddItemToCartRequest;
import com.example.novera.dto.CartResponse;
import com.example.novera.dto.UpdateCartItemRequest;
import com.example.novera.service.CartService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

   @GetMapping
    public CartResponse getCart(HttpServletRequest request) {

        Long userId = Long.parseLong(request.getHeader("X-User-Id"));

        return cartService.getCart(userId);
    }

    @PostMapping("/items")
    public CartResponse addItem(
            HttpServletRequest request,
            @Valid @RequestBody AddItemToCartRequest body) {

        Long userId = Long.parseLong(request.getHeader("X-User-Id"));

        return cartService.addItem(userId, body);
    }

    @PutMapping("/items/{productId}")
    public CartResponse updateItem(
            HttpServletRequest request,
            @PathVariable Long productId,
            @Valid @RequestBody UpdateCartItemRequest body) {

         Long userId = Long.parseLong(request.getHeader("X-User-Id"));

        return cartService.updateItem(
                userId,productId,body);
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Void> removeItem(
            HttpServletRequest request,
            @PathVariable Long productId) {

        Long userId = Long.parseLong(request.getHeader("X-User-Id"));

        cartService.removeItem(userId,productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    //@ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> clearCart(
           HttpServletRequest request) {

        Long userId = Long.parseLong(request.getHeader("X-User-Id"));
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }

}
