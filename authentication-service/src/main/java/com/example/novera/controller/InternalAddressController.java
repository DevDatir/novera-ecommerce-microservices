package com.example.novera.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.novera.dto.AddressResponse;
import com.example.novera.service.AddressService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/internal/addresses")
@RequiredArgsConstructor
public class InternalAddressController {

    private final AddressService addressService;

    @GetMapping("/{id}")
    public AddressResponse getAddress(@PathVariable Long id) {

        return addressService.getAddressById(id);
    }
}
