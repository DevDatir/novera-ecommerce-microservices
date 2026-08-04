package com.example.novera.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.novera.client.AddressClient;
import com.example.novera.client.CartClient;
import com.example.novera.client.ProductClient;
import com.example.novera.dto.OrderItemResponse;
import com.example.novera.dto.OrderResponse;
import com.example.novera.dto.OrderSummaryResponse;
import com.example.novera.dto.PlaceOrderRequest;
import com.example.novera.dto.ShippingAddressResponse;
import com.example.novera.dto.external.AddressResponse;
import com.example.novera.dto.external.CartItemResponse;
import com.example.novera.dto.external.CartResponse;
import com.example.novera.dto.external.PaymentOrderResponse;
import com.example.novera.dto.external.ProductResponse;
import com.example.novera.entity.OrderAddress;
import com.example.novera.entity.OrderEntity;
import com.example.novera.entity.OrderItem;
import com.example.novera.enums.OrderStatus;
import com.example.novera.enums.PaymentStatus;
import com.example.novera.exception.ResourceNotFoundException;
import com.example.novera.mapper.OrderMapper;
import com.example.novera.repository.OrderAddressRepository;
import com.example.novera.repository.OrderItemRepository;
import com.example.novera.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    private final OrderMapper orderMapper;

    private final CartClient cartClient;

    private static final Logger logger
            = LoggerFactory.getLogger(OrderServiceImpl.class);

    private final OrderItemRepository orderItemRepository;

    private final OrderAddressRepository orderAddressRepository;

    private final ProductClient productClient;

    private final AddressClient addressClient;

    private OrderEntity getOrderEntity(Long userId,
            Long orderId) {

        return orderRepository.findById(orderId)
                .filter(order -> order.getUserId().equals(userId))
                .orElseThrow(()
                        -> new ResourceNotFoundException("Order not found"));
    }

    private CartResponse fetchCart(Long userId, String bearerToken) {

        CartResponse cart = cartClient.getCart(bearerToken, userId);

        if (cart == null) {
            throw new ResourceNotFoundException("Cart not found");
        }

        return cart;
    }

    private void validateCart(CartResponse cart) {

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot place order with an empty cart.");
        }
    }

    private Map<Long, ProductResponse> fetchProducts(CartResponse cart) {

        List<Long> productIds = cart.getItems()
                .stream()
                .map(CartItemResponse::getProductId)
                .toList();

        return fetchProducts(productIds);
    }

    private Map<Long, ProductResponse> fetchProducts(List<Long> productIds) {

        List<ProductResponse> products
                = productClient.getProductsByIds(productIds);

        return products.stream()
                .collect(Collectors.toMap(
                        ProductResponse::getId,
                        Function.identity()
                ));
    }

    private AddressResponse fetchAddress(Long addressId,
            String bearerToken) {

        return addressClient.getAddress(addressId, bearerToken);
    }

    private BigDecimal calculateTotal(CartResponse cart,
            Map<Long, ProductResponse> products) {

        return cart.getItems()
                .stream()
                .map(item -> {

                    ProductResponse product
                            = products.get(item.getProductId());

                    return product.getPrice()
                            .multiply(BigDecimal.valueOf(item.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private OrderEntity buildOrder(Long userId,
            BigDecimal totalAmount) {

        return OrderEntity.builder()
                .userId(userId)
                .orderStatus(OrderStatus.PLACED)
                .paymentStatus(PaymentStatus.PENDING)
                .totalAmount(totalAmount)
                .build();
    }

    private void buildOrderItems(OrderEntity order,
            CartResponse cart,
            Map<Long, ProductResponse> products) {

        List<OrderItem> items = cart.getItems()
                .stream()
                .map(cartItem -> {

                    ProductResponse product
                            = products.get(cartItem.getProductId());

                    OrderItem item = OrderItem.builder()
                            .productId(cartItem.getProductId())
                            .quantity(cartItem.getQuantity())
                            .priceAtPurchase(product.getPrice())
                            .order(order)
                            .build();

                    return item;
                })
                .toList();

        order.setOrderItems(items);
    }

    private void buildShippingAddress(OrderEntity order,
            AddressResponse address) {

        OrderAddress shippingAddress = OrderAddress.builder()
                .fullName(address.getFullName())
                .phone(address.getPhone())
                .addressLine1(address.getAddressLine1())
                .addressLine2(address.getAddressLine2())
                .city(address.getCity())
                .state(address.getState())
                .postalCode(address.getPostalCode())
                .country(address.getCountry())
                .order(order)
                .build();

        order.setOrderAddress(shippingAddress);
    }

    private OrderResponse buildOrderResponse(
            OrderEntity order,
            Map<Long, ProductResponse> products) {

        List<OrderItemResponse> items = order.getOrderItems()
                .stream()
                .map(item -> {

                    ProductResponse product
                            = products.get(item.getProductId());

                    return OrderItemResponse.builder()
                            .productId(item.getProductId())
                            .productName(product.getName())
                            .imageUrls(product.getImageUrls())
                            .quantity(item.getQuantity())
                            .priceAtPurchase(item.getPriceAtPurchase())
                            .subtotal(
                                    item.getPriceAtPurchase()
                                            .multiply(BigDecimal.valueOf(item.getQuantity()))
                            )
                            .build();

                })
                .toList();

        ShippingAddressResponse shippingAddress
                = ShippingAddressResponse.builder()
                        .fullName(order.getOrderAddress().getFullName())
                        .phone(order.getOrderAddress().getPhone())
                        .addressLine1(order.getOrderAddress().getAddressLine1())
                        .addressLine2(order.getOrderAddress().getAddressLine2())
                        .city(order.getOrderAddress().getCity())
                        .state(order.getOrderAddress().getState())
                        .postalCode(order.getOrderAddress().getPostalCode())
                        .country(order.getOrderAddress().getCountry())
                        .build();

        return OrderResponse.builder()
                .id(order.getId())
                .orderStatus(order.getOrderStatus())
                .paymentStatus(order.getPaymentStatus())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .shippingAddress(shippingAddress)
                .items(items)
                .build();
    }

    @Override
    @Transactional
    public OrderResponse placeOrder(
            Long userId,
            String bearerToken,
            PlaceOrderRequest request) {

        logger.info("Placing order for user {}", userId);

        CartResponse cart = fetchCart(userId, bearerToken);

        validateCart(cart);

        Map<Long, ProductResponse> products
                = fetchProducts(cart);

        AddressResponse address
                = fetchAddress(request.getAddressId(), bearerToken);

        BigDecimal total
                = calculateTotal(cart, products);

        OrderEntity order
                = buildOrder(userId, total);

        buildOrderItems(order, cart, products);

        buildShippingAddress(order, address);

        OrderEntity savedOrder
                = orderRepository.save(order);

        cartClient.clearCart(bearerToken, userId);

        logger.info("Order {} placed successfully.",
                savedOrder.getId());

        return buildOrderResponse(savedOrder, products);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrder(Long userId,
            Long orderId) {

        OrderEntity order
                = getOrderEntity(userId, orderId);

        List<Long> productIds = order.getOrderItems()
                .stream()
                .map(OrderItem::getProductId)
                .toList();

        Map<Long, ProductResponse> products
                = fetchProducts(productIds);

        return buildOrderResponse(order, products);
    }

    @Override
    public Page<OrderSummaryResponse> getOrders(Long userId,
            Pageable pageable) {

        return orderRepository.findByUserId(userId, pageable)
                .map(orderMapper::toSummaryResponse);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(Long userId,
            Long orderId) {

        OrderEntity order
                = getOrderEntity(userId, orderId);

        if (order.getOrderStatus() == OrderStatus.SHIPPED
                || order.getOrderStatus() == OrderStatus.OUT_FOR_DELIVERY
                || order.getOrderStatus() == OrderStatus.DELIVERED) {

            throw new IllegalStateException(
                    "Order can no longer be cancelled.");
        }

        order.setOrderStatus(OrderStatus.CANCELLED);

        OrderEntity updatedOrder
                = orderRepository.save(order);

        List<Long> productIds = updatedOrder.getOrderItems()
                .stream()
                .map(OrderItem::getProductId)
                .toList();

        Map<Long, ProductResponse> products
                = fetchProducts(productIds);

        return buildOrderResponse(updatedOrder, products);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentOrderResponse getOrderForPayment(Long orderId, Long userId) {

        OrderEntity order = orderRepository
                .findByIdAndUserId(orderId, userId)
                .orElseThrow(()
                        -> new ResourceNotFoundException("Order not found"));

        return PaymentOrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .totalAmount(order.getTotalAmount())
                .paymentStatus(order.getPaymentStatus())
                .build();
    }

    @Override
    @Transactional
    public void markPaymentSuccess(Long orderId, Long userId) {

        OrderEntity order = orderRepository
                .findByIdAndUserId(orderId, userId)
                .orElseThrow(()
                        -> new ResourceNotFoundException("Order not found."));

        order.setPaymentStatus(PaymentStatus.PAID);
        order.setOrderStatus(OrderStatus.CONFIRMED);
    }
}
