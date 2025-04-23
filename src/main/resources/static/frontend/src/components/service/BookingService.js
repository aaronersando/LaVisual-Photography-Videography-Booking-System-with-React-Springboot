import axios from 'axios';

const API_URL = 'http://localhost:8080/api/bookings';

class BookingService {
  // Original method for non-GCash bookings
  async createBooking(bookingData) {
    try {
      console.log("Sending booking data:", bookingData);
      
      const response = await axios.post(API_URL, bookingData);
      return response.data;
    } catch (error) {
      console.error("Error details:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
        return {
          success: false,
          message: error.response.data.message || "Server returned an error",
          statusCode: error.response.status
        };
      } else {
        return {
          success: false,
          message: "Could not connect to server. Please try again.",
          statusCode: 500
        };
      }
    }
  }

  // New method that handles both booking creation and proof upload in one step
  async createBookingWithProof(bookingData, proofFile) {
    try {
      // Create a FormData object to send multipart/form-data
      const formData = new FormData();
      
      // Add the booking data as a JSON string
      formData.append('bookingData', JSON.stringify(bookingData));
      
      // Add the proof file
      formData.append('proofFile', proofFile);
      
      // Send the combined data
      const response = await axios.post(`${API_URL}/with-proof`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("Error creating booking with proof:", error);
      if (error.response) {
        return {
          success: false,
          message: error.response.data.message || "Failed to create booking",
          statusCode: error.response.status
        };
      } else {
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
      const response = await axios.get(`${API_URL}/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching booking:", error);
      return {
        success: false,
        message: "Could not retrieve booking details",
        statusCode: 500
      };
    }
  }
}

export default new BookingService();