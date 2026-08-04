package com.example.novera.service;

import com.example.novera.dto.AuthResponse;
import com.example.novera.dto.LoginRequest;
import com.example.novera.dto.RegisterRequest;

public interface AuthenticationService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}