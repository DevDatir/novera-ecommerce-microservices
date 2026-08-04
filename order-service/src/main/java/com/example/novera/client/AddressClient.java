package com.example.novera.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.novera.dto.external.AddressResponse;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AddressClient {

    private final WebClient webClient;

    @Value("${auth.service.url}")
    private String authServiceUrl;

    public AddressResponse getAddress(Long addressId, String bearerToken) {

        return webClient.get()
                .uri(authServiceUrl + "/api/addresses/" + addressId)
                .header(HttpHeaders.AUTHORIZATION, bearerToken)
                .retrieve()
                .bodyToMono(AddressResponse.class)
                .block();
    }
}