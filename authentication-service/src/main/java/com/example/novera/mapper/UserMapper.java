package com.example.novera.mapper;

import com.example.novera.dto.RegisterRequest;
import com.example.novera.entity.Role;
import com.example.novera.entity.User;

public class UserMapper {

    private UserMapper() {
    }

    public static User toEntity(RegisterRequest request) {
        return User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(request.password())
                .role(Role.USER)
                .build();
    }
}