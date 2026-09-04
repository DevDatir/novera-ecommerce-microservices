package com.example.novera.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import com.example.novera.dto.AddressRequest;
import com.example.novera.dto.AddressResponse;
import com.example.novera.entity.Address;
import com.example.novera.mapper.AddressMapper;
import com.example.novera.repository.AddressRepository;

public class AddressServiceTest {
    @Mock
    AddressMapper addressMapper;
    @Mock
    AddressRepository addressRepository;

    @InjectMocks
    AddressServiceImpl addressService;
    
    @Test
    void testAddAddress() {
        Long userId = 1L;
        Address newAddress = new Address();
        Address savedAddress = new Address();
        AddressResponse response = new AddressResponse();
        AddressRequest request = new AddressRequest();
        request.setIsDefault(false);
        
        when(addressMapper.toEntity(request)).thenReturn(newAddress);
        when(addressRepository.save(newAddress)).thenReturn(savedAddress);
        when(addressMapper.toResponse(savedAddress)).thenReturn(response);

        AddressResponse result = addressService.addAddress(userId, request);

        assertEquals(result, response);
        assertEquals(userId, newAddress.getId());

        verify(addressMapper).toEntity(request);
        verify(addressRepository).save(newAddress);
        verify(addressMapper).toResponse(savedAddress);

    }

    @Test
    void testAddresswithDefaultTrue(){
        Long userId = 1L;
        Address existingDefault = new Address();
        existingDefault.setIsDefault(true);
        AddressRequest request = new AddressRequest();
        request.setIsDefault(true);
        Address newAddress = new Address();
        Address savedAddress = new Address();
        AddressResponse response = new AddressResponse();

        when(addressRepository.findByUserIdAndIsDefaultTrue(userId))
            .thenReturn(Optional.of(existingDefault));

        when(addressMapper.toEntity(request))
                .thenReturn(newAddress);

        when(addressRepository.save(existingDefault))
                .thenReturn(existingDefault);

        when(addressRepository.save(newAddress))
                .thenReturn(savedAddress);

        when(addressMapper.toResponse(savedAddress))
                .thenReturn(response);

        AddressResponse result =
                addressService.addAddress(userId, request);

        assertEquals(response, result);

        assertFalse(existingDefault.getIsDefault());

        assertEquals(userId, newAddress.getUserId());

        verify(addressRepository)
                .findByUserIdAndIsDefaultTrue(userId);

        verify(addressRepository)
                .save(existingDefault);

        verify(addressRepository)
                .save(newAddress);

        verify(addressMapper)
                .toEntity(request);

        verify(addressMapper)
                .toResponse(savedAddress);

    }

    @Test
    void testDeleteAddress() {

    }

    @Test
    void testGetAddress() {

    }

    @Test
    void testGetAddressById() {

    }

    @Test
    void testGetUserAddresses() {

    }

    @Test
    void testUpdateAddress() {

    }
}
