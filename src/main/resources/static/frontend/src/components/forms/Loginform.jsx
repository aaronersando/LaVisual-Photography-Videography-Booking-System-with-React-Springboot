/**
 * Admin Login Form Component
 * 
 * This component provides a user interface for admin authentication in the application.
 * It renders a styled login form with email and password fields, along with error handling
 * and loading states.
 * 
 * The component handles the full authentication flow:
 * - Form submission with validation
 * - API communication through AdminService
 * - Error handling with user-friendly messages
 * - Token storage in localStorage for persistent sessions
 * - Redirection to the admin dashboard upon successful login
 * 
 * Additional features include:
 * - Password visibility toggle
 * - Loading state indication
 * - Temporary error messages that auto-dismiss
 * - Responsive styling with Tailwind CSS
 */

import React, { useState, useEffect } from "react"; // Import React and hooks
import { useNavigate } from "react-router-dom"; // Import navigation hook from React Router
import AdminService from "../service/AdminService"; // Import authentication service

function Loginform() {
  // State variables for form fields and UI control
  const [email, setEmail] = useState(''); // State for email input field
  const [password, setPassword] = useState(''); // State for password input field
  const [error, setError] = useState(''); // State for error messages
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [showPassword, setShowPassword] = useState(false); // State for password visibility toggle
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    if (isLoading) return; // Prevent multiple submissions while loading
    
    setIsLoading(true); // Show loading state
    setError(''); // Clear any previous error messages
    
    try {
      // Attempt to log in using the AdminService
      const userData = await AdminService.login(email, password);
      
      if (userData.token) {
        // If authentication successful (token received)
        localStorage.setItem('token', userData.token); // Store auth token
        localStorage.setItem('role', userData.role); // Store user role
        
        setIsLoading(true); // Maintain loading state during redirect
        
        // Small delay before redirecting to admin dashboard
        setTimeout(() => {
          window.location.href = '/admin';
        }, 100);
      } else {
        // If no token was received but no error thrown
        setError(userData.message || 'Login failed'); // Display error message
        setIsLoading(false); // Hide loading state
      }
    } catch (error) {
      // If an exception occurred during login
      console.error('Login error:', error); // Log error for debugging
      
      // Extract the most relevant error message from the error object
      setError(error.response?.data?.message || error.message || 'An error occurred during login');
      
      // Auto-dismiss error message after 5 seconds
      setTimeout(() => {
        setError('');
      }, 5000);
      
      setIsLoading(false); // Hide loading state
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle between showing and hiding password
  };

  return (
    // Main container with dark styling
    <div className="w-[448px] h-auto min-h-[300px] bg-gray-800 rounded-lg p-8 mx-auto my-12 flex flex-col text-white">
      {/* Header section */}
      <h2 className="text-2xl font-bold text-center mb-1">
        Welcome Back
      </h2>
      
      <p className="text-sm text-gray-400 text-center mb-6">
        Sign in to your account
      </p>
    
      {/* Login form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-2">
          {/* Email input field */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1.5">
              Email Address
            </label>
            <input
              type="email" // Email input with browser validation
              value={email} // Controlled component
              onChange={(e) => setEmail(e.target.value)} // Update state on change
              placeholder="Enter your email"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3.5 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              disabled={isLoading} // Disable during form submission
              required // HTML5 validation
            />
          </div>

          {/* Password input field */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle between text and password type
                value={password} // Controlled component
                onChange={(e) => setPassword(e.target.value)} // Update state on change
                placeholder="Enter your password"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3.5 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                disabled={isLoading} // Disable during form submission
                required // HTML5 validation
              />
              {/* Password visibility toggle button */}
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800 focus:outline-none"
                onClick={togglePasswordVisibility}
                tabIndex="-1" // Exclude from tab order
              >
                {/* Icon changes based on password visibility state */}
                {showPassword ? (
                  <i className="fa-solid fa-eye-slash text-sm"></i> // Hide password icon
                ) : (
                  <i className="fa-solid fa-eye text-sm"></i> // Show password icon
                )}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className={`w-full ${isLoading ? 'bg-purple-700' : 'bg-purple-600 hover:bg-purple-800'} 
                       text-white py-3 px-4 rounded-md text-sm font-medium 
                       transition-colors duration-200 my-2`}
            disabled={isLoading} // Disable during form submission
          >
            {isLoading ? 'Redirecting...' : 'Sign in'} {/* Button text changes based on loading state */}
          </button>
        </div>
      </form>

      {/* Error message display area */}
      <div className="h-[30px] flex items-center mt-4">
        {error && ( // Only show when there's an error
          <div className="w-full bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded">
            <div className="flex items-center">
            <i className="fa fa-exclamation-circle mt-2 w-5 h-5 mr-2 flex-shrink-0 text-red-100" aria-hidden="true"></i>
              <span>
                {/* User-friendly error message based on error content */}
                {error.toLowerCase().includes('unauthorized') || 
                error.toLowerCase().includes('401') || 
                error.toLowerCase().includes('invalid') ? 
                  'Invalid email or password' : // Authentication error
                  error.toLowerCase().includes('network') ?
                  'Network error. Please check your connection.' : // Connection error
                  'Login failed. Please try again.'} {/* Generic error */}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Loginform; // Export component for use in the application