CREATE TABLE IF NOT EXISTS our_users (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Auto-increment ID
    email VARCHAR(255) NOT NULL UNIQUE, -- Email must be unique
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    city VARCHAR(255),
    role VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS bookings (
   booking_id INT AUTO_INCREMENT PRIMARY KEY,
   booking_reference VARCHAR(50) UNIQUE NOT NULL,
   guest_name VARCHAR(255) NOT NULL,
   guest_email VARCHAR(255) NOT NULL,
   guest_phone VARCHAR(20) NOT NULL,   
   booking_date DATE NOT NULL,
   booking_time_start TIME NOT NULL,     
   booking_time_end TIME NOT NULL,   
   booking_hours INT,  
   location VARCHAR(255) NOT NULL,
   category_name VARCHAR(255) NOT NULL,
   package_name VARCHAR(255) NOT NULL,
   package_price DECIMAL(10, 2) NOT NULL,
   special_requests TEXT,
   booking_status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
   payment_id INT NOT NULL, 
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   

);

CREATE TABLE IF NOT EXISTS payments (
   payment_id INT AUTO_INCREMENT PRIMARY KEY,
   booking_id INT NULL,
   amount DECIMAL(10, 2) NOT NULL,
   payment_type ENUM('FULL','DOWNPAYMENT') NOT NULL,
   payment_method VARCHAR(50) NOT NULL,
   payment_status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
   remaining_balance DECIMAL(10, 2) NOT NULL,
   gcash_number VARCHAR(20), 
   payment_proof VARCHAR(255),
   payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)

);

ALTER TABLE bookings
ADD FOREIGN KEY (payment_id) REFERENCES payments(payment_id);