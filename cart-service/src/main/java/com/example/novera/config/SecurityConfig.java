// package com.example.novera.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.http.HttpStatus;
// import org.springframework.security.config.Customizer;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.HttpStatusEntryPoint;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// import com.example.novera.security.JwtAuthenticationFilter;

// @Configuration
// public class SecurityConfig {

//     private final JwtAuthenticationFilter jwtFilter;

//     public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
//         this.jwtFilter = jwtFilter;
//     }

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http)
//             throws Exception {

//         http
//                 .csrf(csrf -> csrf.disable())
//                 .cors(Customizer.withDefaults())

//                 .sessionManagement(session ->
//                         session.sessionCreationPolicy(
//                                 SessionCreationPolicy.STATELESS))

//                 .exceptionHandling(ex -> ex
//                         .authenticationEntryPoint(
//                                 new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))

//                 .authorizeHttpRequests(auth -> auth

//                         .requestMatchers(
//                                 "/swagger-ui/**",
//                                 "/v3/api-docs/**",
//                                 "/api-docs/**")
//                         .permitAll()

//                         .anyRequest()
//                         .authenticated())

//                 .addFilterBefore(
//                         jwtFilter,
//                         UsernamePasswordAuthenticationFilter.class);

//         return http.build();
//     }

// }

package com.example.novera.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth ->
                        auth.anyRequest().permitAll());

        return http.build();
    }
}