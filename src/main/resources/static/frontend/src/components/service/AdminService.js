/**
 * Admin Service
 * 
 * This file provides a service class that handles all admin-related API communications 
 * and authentication utilities for the application. It serves as a central point for:
 * 
 * - User authentication (login, token management)
 * - User management (creating, reading, updating, deleting admin accounts)
 * - Profile management (fetching current admin's profile)
 * - Authorization checks (verifying authentication status and role checks)
 * 
 * The class uses static methods exclusively, allowing them to be called directly
 * without instantiating the class (e.g., AdminService.login()). It uses axios
 * for HTTP requests and localStorage for storing authentication tokens.
 * 
 * This service is typically used in admin components, protected routes, and
 * anywhere admin-related functionality is needed in the application.
 */

import axios from "axios"; // Import axios for making HTTP requests

class AdminService{
    // Base URL for all API requests - used to construct full endpoints
    static BASE_URL = "http://localhost:8080"

    /**
     * Authenticates an admin user with the backend
     * 
     * @param {string} email - Admin's email address
     * @param {string} password - Admin's password
     * @returns {Promise<object>} Authentication response with token and user data
     */
    static async login(email, password){
        try{
            // Send POST request to login endpoint with credentials
            const response = await axios.post(`${AdminService.BASE_URL}/auth/login`, {email, password})
            return response.data; // Return just the response data, not the full axios response

        }catch(err){
            // Propagate error to caller for proper error handling
            throw err;
        }
    }

    /**
     * Registers a new admin user
     * Requires admin privileges (token) to create other admin accounts
     * 
     * @param {object} userData - User data including name, email, password, etc.
     * @param {string} token - Authentication token of the admin creating the account
     * @returns {Promise<object>} Registration response
     */
    static async register(userData, token){
        try{
            // Send POST request with user data and authorization header
            const response = await axios.post(`${AdminService.BASE_URL}/auth/register`, userData, 
            {
                headers: {Authorization: `Bearer ${token}`} // Attach JWT token for authorization
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    /**
     * Fetches all admin users from the system
     * Requires admin privileges
     * 
     * @param {string} token - Authentication token
     * @returns {Promise<object>} Response containing list of admin users
     */
    static async getAllUsers(token){
        try{
            // Send GET request with authorization header
            const response = await axios.get(`${AdminService.BASE_URL}/admin/get-all-users`, 
            {
                headers: {Authorization: `Bearer ${token}`} // Attach JWT token for authorization
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    /**
     * Fetches the profile of the currently logged-in admin
     * 
     * @param {string} token - Authentication token
     * @returns {Promise<object>} Current admin's profile data
     */
    static async getYourProfile(token){
        try{
            // Send GET request to profile endpoint with authorization
            const response = await axios.get(`${AdminService.BASE_URL}/adminuser/get-profile`, 
            {
                headers: {Authorization: `Bearer ${token}`} // Attach JWT token for authorization
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    /**
     * Fetches a specific admin user by their ID
     * 
     * @param {string|number} userId - ID of the user to fetch
     * @param {string} token - Authentication token
     * @returns {Promise<object>} User data for the requested ID
     */
    static async getUserById(userId, token){
        try{
            // Send GET request to get specific user with authorization
            const response = await axios.get(`${AdminService.BASE_URL}/admin/get-users/${userId}`, 
            {
                headers: {Authorization: `Bearer ${token}`} // Attach JWT token for authorization
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    /**
     * Deletes an admin user from the system
     * 
     * @param {string|number} userId - ID of the user to delete
     * @param {string} token - Authentication token
     * @returns {Promise<object>} Response confirming deletion
     */
    static async deleteUser(userId, token){
        try{
            // Send DELETE request to remove user with authorization
            const response = await axios.delete(`${AdminService.BASE_URL}/admin/delete/${userId}`, 
            {
                headers: {Authorization: `Bearer ${token}`} // Attach JWT token for authorization
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    /**
     * Updates an existing admin user's information
     * 
     * @param {string|number} userId - ID of the user to update
     * @param {object} userData - Updated user data
     * @param {string} token - Authentication token
     * @returns {Promise<object>} Response with updated user data
     */
    static async updateUser(userId, userData, token){
        try{
            // Send PUT request with updated data and authorization
            const response = await axios.put(`${AdminService.BASE_URL}/admin/update/${userId}`, userData,
            {
                headers: {Authorization: `Bearer ${token}`} // Attach JWT token for authorization
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    /**AUTHENTICATION CHECKER */
    
    /**
     * Logs out the current admin by removing authentication data
     */
    static logout(){
        localStorage.removeItem('token') // Remove JWT token from storage
        localStorage.removeItem('role') // Remove user role from storage
    }

    /**
     * Checks if a user is currently authenticated
     * 
     * @returns {boolean} True if authenticated (token exists), false otherwise
     */
    static isAuthenticated(){
        const token = localStorage.getItem('token')
        return !!token // Convert to boolean: true if token exists, false if null/undefined
    }

    /**
     * Checks if the current user has admin role
     * 
     * @returns {boolean} True if user has ADMIN role, false otherwise
     */
    static isAdmin(){
        const role = localStorage.getItem('role')
        return role === 'ADMIN' // Check if stored role is ADMIN
    }

    /**
     * Checks if the current user has user role
     * 
     * @returns {boolean} True if user has USER role, false otherwise
     */
    static isUser(){
        const role = localStorage.getItem('role')
        return role === 'USER' // Check if stored role is USER
    }

    /**
     * Checks if current user is both authenticated and has admin privileges
     * 
     * @returns {boolean} True if authenticated and has admin role
     */
    static adminOnly(){
        return this.isAuthenticated() && this.isAdmin(); // Both conditions must be true
    }

}

export default AdminService; // Export the service class for use throughout the application