package com.example.novera.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.novera.dto.AddressRequest;
import com.example.novera.dto.AddressResponse;
import com.example.novera.security.CustomUserDetails;
import com.example.novera.service.AddressService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @PostMapping
    public AddressResponse addAddress(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody AddressRequest request) {

        return addressService.addAddress(userDetails.getUserId(), request);
    }

    @GetMapping
    public List<AddressResponse> getAddresses(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        return addressService.getUserAddresses(userDetails.getUserId());
    }

    @GetMapping("/{id}")
    public AddressResponse getAddress(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {

        return addressService.getAddress(userDetails.getUserId(), id);
    }

    @PutMapping("/{id}")
    public AddressResponse updateAddress(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @RequestBody AddressRequest request) {

        return addressService.updateAddress(
                userDetails.getUserId(),
                id,
                request
        );
    }

    @DeleteMapping("/{id}")
    public void deleteAddress(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {

        addressService.deleteAddress(userDetails.getUserId(), id);
    }
}
