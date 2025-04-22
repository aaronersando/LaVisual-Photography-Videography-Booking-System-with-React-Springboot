import axios from 'axios';

// Use the correct backend URL - Spring Boot typically runs on port 8080
const API_URL = 'http://localhost:8080/api/bookings';

class BookingService {
  // Create a new booking and payment
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