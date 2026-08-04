package com.example.novera.service;

import com.example.novera.client.ProductClient;
import com.example.novera.dto.AddItemToCartRequest;
import com.example.novera.dto.CartItemResponse;
import com.example.novera.dto.CartResponse;
import com.example.novera.dto.ProductResponse;
import com.example.novera.entity.Cart;
import com.example.novera.entity.CartItem;
import com.example.novera.repository.CartItemRepository;
import com.example.novera.repository.CartRepository;
import com.example.novera.service.CartService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.example.novera.dto.UpdateCartItemRequest;
import com.example.novera.exception.CartItemNotFoundException;
import com.example.novera.exception.CartNotFoundException;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductClient productClient;

    public CartServiceImpl(CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductClient productClient) {

        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productClient = productClient;
    }

    @Override
    public CartResponse getCart(Long userId) {

        Cart cart = getOrCreateCart(userId);

        return buildCartResponse(cart);
    }

    @Override
    public CartResponse addItem(Long userId,
            AddItemToCartRequest request) {

        // Verify product exists
        productClient.getProduct(request.getProductId());

        Cart cart = getOrCreateCart(userId);

        CartItem cartItem = cartItemRepository
                .findByCartAndProductId(cart, request.getProductId())
                .orElse(null);

        if (cartItem != null) {

            cartItem.setQuantity(
                    cartItem.getQuantity() + request.getQuantity()
            );

        } else {

            cartItem = CartItem.builder()
                    .cart(cart)
                    .productId(request.getProductId())
                    .quantity(request.getQuantity())
                    .build();
        }

        cartItemRepository.save(cartItem);

        return buildCartResponse(cart);
    }

    private Cart getOrCreateCart(Long userId) {

        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {

                    Cart cart = Cart.builder()
                            .userId(userId)
                            .build();

                    return cartRepository.save(cart);

                });
    }

    private CartResponse buildCartResponse(Cart cart) {

        List<CartItem> cartItems
                = cartItemRepository.findAllByCart(cart);

        List<Long> productIds = cartItems.stream()
                .map(CartItem::getProductId)
                .toList();

        List<ProductResponse> products
                = productClient.getProductsByIds(productIds);

        Map<Long, ProductResponse> productMap
                = products.stream()
                        .collect(Collectors.toMap(
                                ProductResponse::getId,
                                Function.identity()
                        ));

        List<CartItemResponse> itemResponses
                = cartItems.stream()
                        .map(item -> CartItemResponse.builder()
                        .productId(item.getProductId())
                        .quantity(item.getQuantity())
                        .product(productMap.get(item.getProductId()))
                        .build())
                        .toList();

        return CartResponse.builder()
                .cartId(cart.getId())
                .userId(cart.getUserId())
                .items(itemResponses)
                .build();
    }

    @Override
    public CartResponse updateItem(Long userId,
            Long productId,
            UpdateCartItemRequest request) {

        Cart cart = getOrCreateCart(userId);

        CartItem cartItem = cartItemRepository
                .findByCartAndProductId(cart, productId)
                .orElseThrow(()
                        -> new CartItemNotFoundException(
                        "Product not found in cart."
                ));

        cartItem.setQuantity(request.getQuantity());

        cartItemRepository.save(cartItem);

        return buildCartResponse(cart);
    }

    @Override
    public void removeItem(Long userId,
            Long productId) {

        Cart cart = getOrCreateCart(userId);

        CartItem cartItem = cartItemRepository
                .findByCartAndProductId(cart, productId)
                .orElseThrow(() -> new CartItemNotFoundException("product not found"));
                
        cartItemRepository.delete(cartItem);
    }

    @Override
    public void clearCart(Long userId) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(()
                        -> new CartNotFoundException("Cart not found"));

        cartItemRepository.deleteAll(cart.getCartItems());
    }
}
