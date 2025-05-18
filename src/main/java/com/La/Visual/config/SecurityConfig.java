/**
 * Spring Security Configuration File
 *
 * This class configures the security aspects of the application, including:
 * - Authentication: Verifying user identity through JWT tokens
 * - Authorization: Controlling access to different endpoints based on user roles
 * - Security filters: Setting up the filter chain that processes each request
 * - Password encoding: Defining how passwords are securely stored
 * 
 * It establishes a stateless security model using JWT (JSON Web Tokens) for authentication
 * rather than traditional session-based authentication, making it suitable for RESTful APIs.
 * The class defines which endpoints are publicly accessible and which require specific roles,
 * and configures the authentication mechanisms that process login attempts.
 */
package com.La.Visual.config;

// Import Spring Security components for authentication, authorization, and web security configuration
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// Import service for loading user details and HTTP method enum
import com.La.Visual.service.OurUserDetailsService;
import org.springframework.http.HttpMethod;

// Mark this class as a Spring configuration class and enable web security features
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // private final JWTUtilities JWTUtilities;

    // Inject the user details service to load user information from the database
    @Autowired
    private OurUserDetailsService ourUserDetailsService;
    
    // Inject the JWT authentication filter that processes JWT tokens in requests
    @Autowired
    private JWTAuthFilter jwtAuthFilter;

    // SecurityConfig(JWTUtilities JWTUtilities) {
    //     this.JWTUtilities = JWTUtilities;
    // }

    /**
     * Define the security filter chain that processes all incoming HTTP requests
     * This is the main security configuration defining access rules and authentication mechanisms
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf(AbstractHttpConfigurer::disable)  // Disable CSRF protection as we're using stateless JWT authentication
                .cors(Customizer.withDefaults())  // Enable CORS with default settings (relies on CorsConfig)
                .authorizeHttpRequests(request -> request  // Configure authorization rules for different URL patterns
                        // Public endpoints that anyone can access without authentication
                        .requestMatchers("/auth/**", "/public/**").permitAll()  // Authentication and public endpoints
                        .requestMatchers("/favicon.ico").permitAll()  // Browser favicon requests
                        .requestMatchers("/api/files/view/**").permitAll()  // Public file viewing
                        // Role-based access control for different URL patterns
                        .requestMatchers("/admin/**").hasAnyAuthority("ADMIN")  // Admin-only endpoints
                        .requestMatchers("/user/**").hasAnyAuthority("USER")  // User-only endpoints
                        .requestMatchers("/adminuser/**").hasAnyAuthority("ADMIN", "USER")  // Endpoints for both admins and users
                        // These specific API endpoints should come BEFORE the catch-all
                        .requestMatchers("/api/bookings/booked-slots").permitAll()
                        .requestMatchers("/api/bookings").permitAll()
                        .requestMatchers("/api/bookings/with-proof").permitAll()
                        .requestMatchers("/api/bookings/*/payment-proof").permitAll()  // Wildcard path for payment proofs
                        .requestMatchers("/api/bookings/test-endpoint").permitAll()
                        .requestMatchers("/api/files/upload").permitAll()
                        .requestMatchers("/api/files/download/**").permitAll()
                        // OPTIONS requests for CORS preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()  // Allow OPTIONS requests for CORS preflight
                        // Specific admin-only booking endpoints
                        .requestMatchers("/api/bookings/pending").hasAuthority("ADMIN")
                        .requestMatchers("/api/bookings/{id}/approve").hasAuthority("ADMIN") 
                        .requestMatchers("/api/bookings/{id}/reject").hasAuthority("ADMIN")
                        .requestMatchers("/api/bookings/{id}/details").hasAuthority("ADMIN")
                        // This catch-all should come LAST
                        .requestMatchers("/api/bookings/**").hasAuthority("ADMIN")  // Any other booking endpoints require ADMIN
                        .anyRequest().authenticated())  // Any other request requires authentication (but not specific role)
                    .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))  // Use stateless sessions (no server-side session state)
                    .authenticationProvider(authenticationProvider())  // Set the authentication provider
                    .addFilterBefore(  // Add the JWT filter before the standard username/password filter
                        jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();  // Build and return the configured security filter chain
    }

    /**
     * Define the authentication provider that validates user credentials
     * This connects the user details service and password encoder
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();  // Create a DAO-based authentication provider
        daoAuthenticationProvider.setUserDetailsService(ourUserDetailsService);  // Set the user details service
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());  // Set the password encoder
        return daoAuthenticationProvider;
    }
    
    /**
     * Define the password encoder that handles secure password storage
     * BCrypt is a strong adaptive hashing function designed for password hashing
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();  // Use BCrypt for password encoding (secure one-way hashing)
    }

    /**
     * Expose the authentication manager as a bean
     * This is used by the authentication process to validate credentials
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();  // Get the authentication manager from the configuration
    }



}