package com.example.novera.config;

// removed unused ConfigurationProperties
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {
    @Value("${services.product}")
    private String productServiceUrl;

    @Value("${services.auth}")
    private String authServiceUrl;

    @Value("${services.order}")
    private String orderServiceUrl;

    @Value("${services.cart}")
    private String cartServiceUrl;

    @Value("${services.payment}")
    private String paymentServiceUrl;
    
    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {

        return builder.routes()

                .route("authentication-service", r -> r
                        .path("/api/auth/**", "/api/addresses/**")
                        .uri(authServiceUrl))

                .route("product-service", r -> r
                        .path("/api/products/**", "/api/categories/**")
                        .uri(productServiceUrl))

                .route("cart-service", r -> r
                        .path("/api/cart/**")
                        .uri(cartServiceUrl))

                .route("order-service", r -> r
                        .path("/api/orders/**")
                        .uri(orderServiceUrl))

                .route("payment-service", r -> r
                        .path("/api/payments/**")
                        .uri(paymentServiceUrl))

                .build();
        }
}