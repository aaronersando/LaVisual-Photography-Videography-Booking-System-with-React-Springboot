package com.La.Visual.admin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.La.Visual.admin.admin_repository;


@Service
public class AuthenticationService implements UserDetailsService{

    @Autowired
    private admin_repository adminsRepository;

    @Override
    public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
        return adminsRepository.findByEmail(name)
                .orElseThrow(() -> new UsernameNotFoundException("admin not found with email: " + name));
    }

}
