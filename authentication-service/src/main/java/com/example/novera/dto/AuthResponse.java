package com.example.novera.dto;

import com.example.novera.entity.Role;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {

    private String token;
    private String email;
    private Role role;
}