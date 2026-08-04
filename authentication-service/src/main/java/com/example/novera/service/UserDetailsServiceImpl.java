package com.example.novera.service;

import com.example.novera.exception.UserNotFoundException;
import com.example.novera.repository.UserRepository;
import com.example.novera.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) {

        return userRepository.findByEmail(email)
                .map(user -> new CustomUserDetails(user, user.getId()))
                .orElseThrow(() -> new UserNotFoundException(email));
    }
}