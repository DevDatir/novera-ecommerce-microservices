package com.example.novera.filter;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;

import com.example.novera.security.JwtService;

import reactor.core.publisher.Mono;

class JwtAuthenticationFilterTest {

    @Test
    void rejectsInternalEndpoint() {
        JwtService jwtService = org.mockito.Mockito.mock(JwtService.class);
        GatewayFilterChain chain = org.mockito.Mockito.mock(GatewayFilterChain.class);
        MockServerWebExchange exchange = MockServerWebExchange.from(
                MockServerHttpRequest.get("/api/orders/internal/1").build());

        new JwtAuthenticationFilter(jwtService).filter(exchange, chain).block();

        assertThat(exchange.getResponse().getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        verifyNoInteractions(jwtService, chain);
    }

    @Test
    void allowsCorsPreflight() {
        JwtService jwtService = org.mockito.Mockito.mock(JwtService.class);
        GatewayFilterChain chain = org.mockito.Mockito.mock(GatewayFilterChain.class);
        MockServerWebExchange exchange = MockServerWebExchange.from(
                MockServerHttpRequest.method(HttpMethod.OPTIONS, "/api/cart").build());
        when(chain.filter(exchange)).thenReturn(Mono.empty());

        new JwtAuthenticationFilter(jwtService).filter(exchange, chain).block();

        verify(chain).filter(exchange);
        verifyNoInteractions(jwtService);
    }
}
