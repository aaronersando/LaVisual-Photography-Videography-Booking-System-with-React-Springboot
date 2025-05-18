/**
 * Database Schema for La Visual Booking System
 * 
 * This SQL schema file defines the database structure for the La Visual booking application.
 * It creates four main tables that form the backbone of the system:
 * 
 * 1. our_users - Stores user account information for authentication and user management
 * 2. bookings - Records all photography booking appointments and their details
 * 3. payments - Tracks payment information related to bookings
 * 4. unavailable_time_ranges - Manages blocked time slots that aren't available for booking
 * 
 * The schema establishes relationships between tables through foreign keys,
 * ensuring data integrity across the system. It uses conditional creation with
 * "IF NOT EXISTS" to allow safe re-execution of the script without errors.
 * 
 * This schema supports the core functionality of user management, booking processing,
 * payment tracking, and schedule management in the application.
 */

-- Users table for storing account information
CREATE TABLE IF NOT EXISTS our_users (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Auto-increment ID
    email VARCHAR(255) NOT NULL UNIQUE, -- Email must be unique
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL, -- Stores hashed password, not plaintext
    city VARCHAR(255),              -- Optional user location
    role VARCHAR(50)                -- User role for authorization (e.g., admin, customer)
);

-- Bookings table for storing photography appointment information
CREATE TABLE IF NOT EXISTS bookings (
   booking_id INT AUTO_INCREMENT PRIMARY KEY,
   booking_reference VARCHAR(50) UNIQUE NOT NULL, -- Unique reference code for the booking
   guest_name VARCHAR(255) NOT NULL,              -- Customer name
   guest_email VARCHAR(255) NOT NULL,             -- Customer email for communication
   guest_phone VARCHAR(20) NOT NULL,              -- Customer phone for communication
   booking_date DATE NOT NULL,                    -- Date of the photography session
   booking_time_start TIME NOT NULL,              -- Start time of the session
   booking_time_end TIME NOT NULL,                -- End time of the session
   booking_hours INT,                             -- Duration in hours (calculated field)
   location VARCHAR(255) NOT NULL,                -- Location of the photo shoot
   category_name VARCHAR(255) NOT NULL,           -- Photography category (e.g., portrait, wedding)
   package_name VARCHAR(255) NOT NULL,            -- Selected photography package
   package_price DECIMAL(10, 2) NOT NULL,         -- Price of the selected package
   special_requests TEXT,                         -- Any special requests from the customer
   booking_status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING', -- Current status
   payment_id INT NOT NULL,                       -- Reference to the payment record
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- When the booking was created
);

-- Payments table for tracking payment information
CREATE TABLE IF NOT EXISTS payments (
   payment_id INT AUTO_INCREMENT PRIMARY KEY,
   booking_id INT NULL,                          -- Reference to the associated booking
   amount DECIMAL(10, 2) NOT NULL,               -- Payment amount
   payment_type ENUM('FULL','DOWNPAYMENT') NOT NULL, -- Whether full payment or partial downpayment
   payment_method VARCHAR(50) NOT NULL,          -- How payment was made (e.g., GCash, bank transfer)
   payment_status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING', -- Current status
   remaining_balance DECIMAL(10, 2) NOT NULL,    -- Amount still owed (if any)
   gcash_number VARCHAR(20),                     -- GCash mobile payment account number
   payment_proof VARCHAR(255),                   -- Reference to uploaded payment proof image
   payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the payment was made
   FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) -- Link to the bookings table
);

-- Create a foreign key relationship from bookings to payments (bidirectional relationship)
ALTER TABLE bookings
ADD FOREIGN KEY (payment_id) REFERENCES payments(payment_id);

-- Unavailable time ranges table for blocked scheduling slots
CREATE TABLE IF NOT EXISTS unavailable_time_ranges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date VARCHAR(10) NOT NULL,       -- Date in YYYY-MM-DD format
    start_time VARCHAR(8) NOT NULL,  -- Start time in HH:MM:SS format
    end_time VARCHAR(8) NOT NULL,    -- End time in HH:MM:SS format
    status VARCHAR(20) NOT NULL      -- Status reason (e.g., "unavailable", "holiday")
);

-- Create an index on date for faster lookups of unavailable ranges by date
CREATE INDEX IF NOT EXISTS idx_unavailable_time_ranges_date ON unavailable_time_ranges(date);

-- Add payment_proof column to bookings table if it doesn't exist already
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_proof VARCHAR(255);
-- ALTER TABLE bookings ADD COLUMN admin_notes TEXT; -- Commented out (planned future feature)