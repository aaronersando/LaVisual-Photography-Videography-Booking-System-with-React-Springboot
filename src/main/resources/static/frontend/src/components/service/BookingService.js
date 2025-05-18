/**
 * Booking Service
 * 
 * This file provides a service class that manages all booking-related API communications
 * between the frontend application and the backend server. It handles:
 * 
 * - Creating standard bookings
 * - Creating bookings with payment proof uploads
 * - Retrieving booking details
 * 
 * The service abstracts away the complexity of API calls, error handling, and data formatting,
 * providing a clean interface for other components to use when working with booking data.
 * 
 * It returns consistent response objects that include success status, messages, and data,
 * making it easier for UI components to handle both successful and failed operations.
 */

import axios from 'axios'; // Import axios library for making HTTP requests

// Base URL for all booking-related API endpoints
const API_URL = 'http://localhost:8080/api/bookings';

class BookingService {
  // Original method for non-GCash bookings
  async createBooking(bookingData) {
    try {
      // Log the data being sent to the server for debugging purposes
      console.log("Sending booking data:", bookingData);
      
      // Send POST request to the API with booking data
      const response = await axios.post(API_URL, bookingData);
      // Return just the response data, not the full axios response
      return response.data;
    } catch (error) {
      // Log error details to console for debugging
      console.error("Error details:", error);
      // Check if we received a response from the server
      if (error.response) {
        // Server responded with an error status
        console.error("Server response:", error.response.data);
        // Return a standardized error response object
        return {
          success: false, // Indicate the operation failed
          message: error.response.data.message || "Server returned an error", // Use server message or default
          statusCode: error.response.status // Include HTTP status code
        };
      } else {
        // No response received - likely a network error
        return {
          success: false,
          message: "Could not connect to server. Please try again.",
          statusCode: 500 // Internal Server Error as default
        };
      }
    }
  }

  // New method that handles both booking creation and proof upload in one step
  async createBookingWithProof(bookingData, proofFile) {
    try {
      // Create a FormData object to send multipart/form-data
      // FormData is required for file uploads
      const formData = new FormData();
      
      // Add the booking data as a JSON string
      // The server will parse this back into an object
      formData.append('bookingData', JSON.stringify(bookingData));
      
      // Add the proof file to the form data
      formData.append('proofFile', proofFile);
      
      // Send the combined data to a specialized endpoint for handling file uploads
      const response = await axios.post(`${API_URL}/with-proof`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Required header for file uploads
        }
      });
      
      // Return the processed data from the server
      return response.data;
    } catch (error) {
      // Log error information for debugging
      console.error("Error creating booking with proof:", error);
      if (error.response) {
        // Server responded with an error
        return {
          success: false,
          message: error.response.data.message || "Failed to create booking", // Use server message or default
          statusCode: error.response.status
        };
      } else {
        // Network or other error occurred
        return {
          success: false,
          message: "Could not connect to server. Please try again.",
          statusCode: 500
        };
      }
    }
  }

  // Get booking by ID
  async getBookingById(bookingId) {
    try {
      // Send GET request to retrieve a specific booking
      const response = await axios.get(`${API_URL}/${bookingId}`);
      return response.data;
    } catch (error) {
      // Log error and return standardized error response
      console.error("Error fetching booking:", error);
      return {
        success: false,
        message: "Could not retrieve booking details",
        statusCode: 500
      };
    }
  }
}

// Create a single instance of the service and export it
// This allows the service to be imported and used directly without creating new instances
export default new BookingService();