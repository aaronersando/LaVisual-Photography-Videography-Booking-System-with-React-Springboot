package com.La.Visual.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import lombok.With;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
@With
@Builder(toBuilder = true)
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class OurUsers implements UserDetails {
    private final Integer id;
    private final String email;
    private final String name;
    private final String password;
    private final String city;
    private final String role;

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
        return id != null ? id : 0; // Return 0 if id is null
    }
}