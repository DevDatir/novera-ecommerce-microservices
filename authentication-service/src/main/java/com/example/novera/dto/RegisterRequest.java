package com.example.novera.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

// @Data
// public class RegisterRequest {

//     @NotBlank
//     private String firstName;

//     @NotBlank
//     private String lastName;

//     @Email
//     @NotBlank
//     private String email;

//     @NotBlank
//     private String password;
// }

public record RegisterRequest(
    
    @NotBlank String firstName,

    @NotBlank String lastName,

    @Email @NotBlank String email,

    @NotBlank String password) {

}