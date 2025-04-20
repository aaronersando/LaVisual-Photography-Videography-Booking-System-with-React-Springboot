package com.La.Visual.service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.La.Visual.dto.RequestResponse;
import com.La.Visual.entity.OurUsers;
import com.La.Visual.repository.UsersRepository;

@Service
public class UsersManagementService {

    private final AuthenticationProvider authenticationProvider;

    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private JWTUtilities jwtUtilities;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;

    UsersManagementService(AuthenticationProvider authenticationProvider) {
        this.authenticationProvider = authenticationProvider;
    }

    public RequestResponse register(RequestResponse registrationRequest) {
        RequestResponse response = new RequestResponse();
    
        try {
            // Create a new OurUsers object with the provided details
            OurUsers ourUser = new OurUsers(null, null, null, null, null, null)
                .withEmail(registrationRequest.getEmail())
                .withName(registrationRequest.getName())
                .withPassword(passwordEncoder.encode(registrationRequest.getPassword()))
                .withCity(registrationRequest.getCity())
                .withRole(registrationRequest.getRole()); // Default role
    
            // Save the user to the database
            OurUsers ourUserResult = usersRepository.save(ourUser);
    
            // Populate the response with the saved user details
            if (ourUserResult.getId() > 0) {
                response.setOurUsers(ourUserResult);
                response.setStatusCode(200);
                response.setMessage("User registered successfully");
            } else {
                response.setStatusCode(400);
                response.setError("User registration failed");
            }
    
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError("Error occurred: " + e.getMessage());
        }
    
        return response;
    }

    public RequestResponse login(RequestResponse loginRequest) {
        RequestResponse response = new RequestResponse();
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), 
                                        loginRequest.getPassword()));

            var user = usersRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow();
            var jwt = jwtUtilities.generateToken(user);
            var refreshToken = jwtUtilities.generateRefreshToken(new HashMap<>(),user);
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRole(user.role());
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hrs");
            response.setMessage("Login successful");

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public RequestResponse refreshToken(RequestResponse refreshTokenRequest) {
        RequestResponse response = new RequestResponse();
        try {
            String ourEmail = jwtUtilities.extractUserName(refreshTokenRequest.getToken());
            OurUsers users = usersRepository.findByEmail(ourEmail).orElseThrow();
            if(jwtUtilities.isTokenValid(refreshTokenRequest.getToken(), users)){
                var jwt = jwtUtilities.generateToken(users);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setMessage("Token refreshed successfully");
                response.setExpirationTime("24Hrs");
                response.setRefreshToken(refreshTokenRequest.getToken());
            }
            response.setStatusCode(200);
            return response;

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
            return response;
        } 
    }

    public RequestResponse getAllUsers(){
        RequestResponse response = new RequestResponse();
        try {
            List<OurUsers> result = usersRepository.findAll();
            if(!result.isEmpty()){
                response.setStatusCode(200);
                response.setOurUsersList(result);
                response.setMessage("Users retrieved successfully");

            } else {
                response.setStatusCode(404);
                response.setMessage("No users found");
            }
            return response;
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Occured" + e.getMessage());
            return response;
        }
    }

    public RequestResponse getUserById(Integer id){
        RequestResponse response = new RequestResponse();
        try {
            OurUsers usersById = usersRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found")) ;
            response.setOurUsers(usersById);
            response.setStatusCode(200);
            response.setMessage("Users with " + id + " retrieved successfully");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Occured" + e.getMessage());
            
        }
        return response;
    }

    public RequestResponse deleteUser(Integer id){
        RequestResponse response = new RequestResponse();
        try {
            Optional<OurUsers> user = usersRepository.findById(id);
            if (user.isPresent()) {
                usersRepository.deleteById(id);
                response.setStatusCode(200);
                response.setMessage("User with " + id + " deleted successfully");
            } else {
                response.setStatusCode(404);
                response.setMessage("User not found for deletion");
            }
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occured while deleting user" + e.getMessage());

        }
        return response;
    }

    public RequestResponse updateUser(Integer userId, OurUsers updatedUser) {
        RequestResponse response = new RequestResponse();
        try {
            Optional<OurUsers> userOptional = usersRepository.findById(userId);
            if (userOptional.isPresent()) {
                OurUsers existingUser = userOptional.get()
                    .withName(updatedUser.name())
                    .withEmail(updatedUser.email())
                    .withCity(updatedUser.city())
                    .withRole(updatedUser.role());
    
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    existingUser = existingUser.withPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }
    
                OurUsers savedUser = usersRepository.update(existingUser);
                response.setStatusCode(200);
                response.setMessage("User with ID " + userId + " updated successfully");
                response.setOurUsers(savedUser);
            } else {
                response.setStatusCode(404);
                response.setMessage("User not found for update");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while updating user: " + e.getMessage());
        }
        return response;
    }


    public RequestResponse getMyInfo(String email){
        RequestResponse response = new RequestResponse();

        try {
            Optional<OurUsers> userOptional = usersRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                OurUsers user = userOptional.get();
                response.setStatusCode(200);
                response.setMessage("User information retrieved successfully");
                response.setOurUsers(user);
            } else {
                response.setStatusCode(404);
                response.setMessage("User not found");
            }
        
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while retrieving user information: " + e.getMessage());
        
        }
        return response;
    }
    

}
