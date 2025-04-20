package com.La.Visual.entity;

import lombok.Builder;
// import lombok.Data;
import lombok.With;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Builder
@With
public record OurUsers(
    Integer id,
    String email,
    String name,
    String password,
    String city,
    String role
) implements UserDetails {

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Customize this logic if needed
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Customize this logic if needed
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Customize this logic if needed
    }

    @Override
    public boolean isEnabled() {
        return true; // Customize this logic if needed
    }

    public int getId() {
        return id; // Return 0 if id is null
    }

    // public String getEmail() {
        
    // }

    // public String getName() {
        
    // }

    // public String getCity() {
        
    // }

    // public String getRole() {
        
    // }
}
