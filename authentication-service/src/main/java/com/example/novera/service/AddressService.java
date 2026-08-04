package com.example.novera.service;

import java.util.List;

import com.example.novera.dto.AddressRequest;
import com.example.novera.dto.AddressResponse;

public interface AddressService {

    AddressResponse addAddress(Long userId, AddressRequest request);

    List<AddressResponse> getUserAddresses(Long userId);

    AddressResponse getAddress(Long userId, Long addressId);

    AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request);

    void deleteAddress(Long userId, Long addressId);

    // for internal API Call
    AddressResponse getAddressById(Long addressId);
}