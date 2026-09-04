package com.example.novera.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.novera.dto.AuthResponse;
import com.example.novera.dto.LoginRequest;
import com.example.novera.dto.RegisterRequest;
import com.example.novera.entity.Role;
import com.example.novera.entity.User;
import com.example.novera.exception.EmailAlreadyExistsException;
import com.example.novera.exception.UserNotFoundException;
import com.example.novera.repository.UserRepository;
import com.example.novera.security.JwtService;

/**
 * Unit tests for {@link AuthenticationServiceImpl}.
 *
 * Demonstrates:
 * 1. JUnit 5 (@Test, @DisplayName, @Nested, @BeforeEach, Assertions)
 * 2. Mockito (@ExtendWith, @Mock, @InjectMocks, when/thenReturn, verify, ArgumentCaptor)
 */
@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    // 1. Mocks: simulated dependencies of AuthenticationServiceImpl
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    // 2. InjectMocks: creates real AuthenticationServiceImpl and injects the mocks above
    @InjectMocks
    private AuthenticationServiceImpl authenticationService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User mockUser;

    @BeforeEach
    void setUp() {
        // Setup common test fixtures before each test
        registerRequest = new RegisterRequest(
                "John",
                "Doe",
                "john.doe@example.com",
                "password123"
        );

        loginRequest = new LoginRequest();
        loginRequest.setEmail("john.doe@example.com");
        loginRequest.setPassword("password123");

        mockUser = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("encoded_secret_hash")
                .role(Role.USER)
                .build();
    }

    @Nested
    @DisplayName("register() tests")
    class RegisterTests {

        @Test
        @DisplayName("Should successfully register a new user when email is not taken")
        void register_Success() {
            // ARRANGE (Given)
            String rawPassword = "password123";
            String encodedPassword = "encoded_secret_hash";
            String generatedToken = "mock.jwt.token";

            when(userRepository.existsByEmail(registerRequest.email())).thenReturn(false);
            when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);
            when(jwtService.generateToken(any(User.class))).thenReturn(generatedToken);

            // ACT (When)
            AuthResponse response = authenticationService.register(registerRequest);

            // ASSERT (Then)
            assertNotNull(response, "Response should not be null");
            assertEquals(generatedToken, response.getToken());
            assertEquals("john.doe@example.com", response.getEmail());
            assertEquals(Role.USER, response.getRole());

            // VERIFY interactions with mocks
            verify(userRepository).existsByEmail("john.doe@example.com");
            verify(passwordEncoder).encode("password123");

            // Use ArgumentCaptor to verify the exact User entity saved to the database
            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(userCaptor.capture());

            User savedUser = userCaptor.getValue();
            assertEquals("John", savedUser.getFirstName());
            assertEquals("Doe", savedUser.getLastName());
            assertEquals("john.doe@example.com", savedUser.getEmail());
            assertEquals(encodedPassword, savedUser.getPassword());
            assertEquals(Role.USER, savedUser.getRole());

            verify(jwtService).generateToken(savedUser);
        }

        @Test
        @DisplayName("Should throw EmailAlreadyExistsException when email is already registered")
        void register_EmailAlreadyExists_ThrowsException() {
            // ARRANGE
            when(userRepository.existsByEmail(registerRequest.email())).thenReturn(true);

            // ACT & ASSERT
            EmailAlreadyExistsException exception = assertThrows(
                    EmailAlreadyExistsException.class,
                    () -> authenticationService.register(registerRequest)
            );

            assertEquals("User with email 'john.doe@example.com' already exists.", exception.getMessage());

            // VERIFY: Ensure nothing was saved or encoded if validation failed early
            verify(passwordEncoder, never()).encode(any());
            verify(userRepository, never()).save(any());
            verify(jwtService, never()).generateToken(any());
        }
    }

    @Nested
    @DisplayName("login() tests")
    class LoginTests {

        @Test
        @DisplayName("Should successfully authenticate and return token for valid credentials")
        void login_Success() {
            // ARRANGE
            String generatedToken = "mock.jwt.token";

            when(userRepository.findByEmail(loginRequest.getEmail()))
                    .thenReturn(Optional.of(mockUser));
            when(jwtService.generateToken(mockUser))
                    .thenReturn(generatedToken);

            // ACT
            AuthResponse response = authenticationService.login(loginRequest);

            // ASSERT
            assertNotNull(response);
            assertEquals(generatedToken, response.getToken());
            assertEquals(mockUser.getEmail(), response.getEmail());
            assertEquals(mockUser.getRole(), response.getRole());

            // VERIFY
            verify(authenticationManager).authenticate(
                    new UsernamePasswordAuthenticationToken("john.doe@example.com", "password123")
            );
            verify(userRepository).findByEmail("john.doe@example.com");
            verify(jwtService).generateToken(mockUser);
        }

        @Test
        @DisplayName("Should throw BadCredentialsException when authentication manager fails")
        void login_InvalidCredentials_ThrowsBadCredentialsException() {
            // ARRANGE
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenThrow(new BadCredentialsException("Bad credentials"));

            // ACT & ASSERT
            assertThrows(
                    BadCredentialsException.class,
                    () -> authenticationService.login(loginRequest)
            );

            // VERIFY: Should not look up repository or issue token if authentication failed
            verify(userRepository, never()).findByEmail(any());
            verify(jwtService, never()).generateToken(any());
        }

        @Test
        @DisplayName("Should throw UserNotFoundException when user record does not exist")
        void login_UserNotFound_ThrowsUserNotFoundException() {
            // ARRANGE
            when(userRepository.findByEmail(loginRequest.getEmail()))
                    .thenReturn(Optional.empty());

            // ACT & ASSERT
            UserNotFoundException exception = assertThrows(
                    UserNotFoundException.class,
                    () -> authenticationService.login(loginRequest)
            );

            assertEquals("User with email 'john.doe@example.com' not found.", exception.getMessage());

            // VERIFY
            verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
            verify(userRepository).findByEmail("john.doe@example.com");
            verify(jwtService, never()).generateToken(any());
        }
    }
}
