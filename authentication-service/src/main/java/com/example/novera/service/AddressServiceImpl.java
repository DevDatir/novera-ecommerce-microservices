package com.example.novera.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.novera.dto.AddressRequest;
import com.example.novera.dto.AddressResponse;
import com.example.novera.entity.Address;
import com.example.novera.exception.ResourceNotFoundException;
import com.example.novera.mapper.AddressMapper;
import com.example.novera.repository.AddressRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;

    @Override
    public AddressResponse addAddress(Long userId, AddressRequest request) {

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            addressRepository.findByUserIdAndIsDefaultTrue(userId)
                    .ifPresent(address -> {
                        address.setIsDefault(false);
                        addressRepository.save(address);
                    });
        }

        Address address = addressMapper.toEntity(request);
        address.setUserId(userId);

        Address savedAddress = addressRepository.save(address);

        return addressMapper.toResponse(savedAddress);
    }

    @Override
    public List<AddressResponse> getUserAddresses(Long userId) {

        return addressRepository.findByUserId(userId)
                .stream()
                .map(addressMapper::toResponse)
                .toList();
    }

    @Override
    public AddressResponse getAddress(Long userId, Long addressId) {

        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Address not found"));

        return addressMapper.toResponse(address);
    }

    @Override
    public AddressResponse updateAddress(Long userId,
                                         Long addressId,
                                         AddressRequest request) {

        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Address not found"));

        if (Boolean.TRUE.equals(request.getIsDefault())) {

            addressRepository.findByUserIdAndIsDefaultTrue(userId)
                    .ifPresent(defaultAddress -> {
                        defaultAddress.setIsDefault(false);
                        addressRepository.save(defaultAddress);
                    });
        }

        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPostalCode(request.getPostalCode());
        address.setCountry(request.getCountry());
        address.setIsDefault(request.getIsDefault());

        Address updatedAddress = addressRepository.save(address);

        return addressMapper.toResponse(updatedAddress);
    }

    @Override
    public void deleteAddress(Long userId, Long addressId) {

        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Address not found"));

        addressRepository.delete(address);
    }

    @Override
    public AddressResponse getAddressById(Long addressId) {

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Address not found"));

        return addressMapper.toResponse(address);
    }
}