package com.La.Visual.admin.service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.La.Visual.admin.admin;
import com.La.Visual.admin.admin_repository;
import com.La.Visual.admin.dto.RequestResponse;


@Service
public class AdminManagementService {

    private final AuthenticationProvider authenticationProvider;

    @Autowired
    private admin_repository adminsRepository;
    @Autowired
    private JWTUtilities jwtUtilities;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;

    AdminManagementService(AuthenticationProvider authenticationProvider) {
        this.authenticationProvider = authenticationProvider;
    }

   //  public RequestResponse register(RequestResponse registrationRequest) {
   //      RequestResponse response = new RequestResponse();
    
   //      try {
   //          // Create a new OurUsers object with the provided details
   //          OurUsers ourUser = new OurUsers(null, null, null, null, null, null)
   //              .withEmail(registrationRequest.getEmail())
   //              .withName(registrationRequest.getName())
   //              .withPassword(passwordEncoder.encode(registrationRequest.getPassword()))
   //              .withCity(registrationRequest.getCity())
   //              .withRole(registrationRequest.getRole()); // Default role
    
   //          // Save the user to the database
   //          OurUsers ourUserResult = usersRepository.save(ourUser);
    
   //          // Populate the response with the saved user details
   //          if (ourUserResult.getId() > 0) {
   //              response.setOurUsers(ourUserResult);
   //              response.setStatusCode(200);
   //              response.setMessage("User registered successfully");
   //          } else {
   //              response.setStatusCode(400);
   //              response.setError("User registration failed");
   //          }
    
   //      } catch (Exception e) {
   //          response.setStatusCode(500);
   //          response.setError("Error occurred: " + e.getMessage());
   //      }
    
   //      return response;
   //  }

    public RequestResponse login(RequestResponse loginRequest) {
        RequestResponse response = new RequestResponse();
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), 
                                        loginRequest.getPassword()));

            var admin = adminsRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow();
            var jwt = jwtUtilities.generateToken(admin);
            var refreshToken = jwtUtilities.generateRefreshToken(new HashMap<>(),admin);
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRole(admin.role().toString());
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
            admin admins = adminsRepository.findByEmail(ourEmail).orElseThrow();
            if(jwtUtilities.isTokenValid(refreshTokenRequest.getToken(), admins)){
                var jwt = jwtUtilities.generateToken(admins);
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
            List<admin> result = adminsRepository.findAll();
            if(!result.isEmpty()){
                response.setStatusCode(200);
                response.setAdminsList(result);
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
            admin adminsById = adminsRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found")) ;
            response.setAdmins(adminsById);
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
            Optional<admin> user = adminsRepository.findById(id);
            if (user.isPresent()) {
                adminsRepository.deleteById(id);
                response.setStatusCode(200);
                response.setMessage("Admin with " + id + " deleted successfully");
            } else {
                response.setStatusCode(404);
                response.setMessage("Admin not found for deletion");
            }
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occured while deleting user" + e.getMessage());

        }
        return response;
    }

    public RequestResponse updateAdmin(Integer Id, admin updatedAdmin) {
        RequestResponse response = new RequestResponse();
        try {
            Optional<admin> userOptional = adminsRepository.findById(Id);
            if (userOptional.isPresent()) {
                admin existingAdmin = userOptional.get()
                    .withName(updatedAdmin.name())
                    .withEmail(updatedAdmin.email());
    
                if (updatedAdmin.getPassword() != null && !updatedAdmin.getPassword().isEmpty()) {
                    existingAdmin = existingAdmin.withPassword(passwordEncoder.encode(updatedAdmin.getPassword()));
                }
    
                admin savedadmin = adminsRepository.update(existingAdmin);
                response.setStatusCode(200);
                response.setMessage("Admin with ID " + Id + " updated successfully");
                response.setAdmins(savedadmin);
            } else {
                response.setStatusCode(404);
                response.setMessage("Admin not found for update");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while updating admin: " + e.getMessage());
        }
        return response;
    }


    public RequestResponse getMyInfo(String email){
        RequestResponse response = new RequestResponse();

        try {
            Optional<admin> userOptional = adminsRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                admin admins = userOptional.get();
                response.setStatusCode(200);
                response.setMessage("Admin information retrieved successfully");
                response.setAdmins(admins);
            } else {
                response.setStatusCode(404);
                response.setMessage("Admin not found");
            }
        
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while retrieving Admin information: " + e.getMessage());
        
        }
        return response;
    }
    

}
