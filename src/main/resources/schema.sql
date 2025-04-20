CREATE TABLE IF NOT EXISTS admins (
   id INT AUTO_INCREMENT PRIMARY KEY,
   email VARCHAR(255) NOT NULL UNIQUE,
   name VARCHAR(255) NOT NULL UNIQUE,
   password VARCHAR(255) NOT NULL,
   role ENUM('ADMIN') DEFAULT 'ADMIN' 
);


CREATE TABLE IF NOT EXISTS bookings (
   booking_id INT AUTO_INCREMENT PRIMARY KEY, 
   guest_name VARCHAR(255) NOT NULL,
   guest_email VARCHAR(255) NOT NULL,
   guest_phone VARCHAR(20) NOT NULL,   
   booking_date DATE NOT NULL,
   booking_time TIME NOT NULL,     
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
   booking_id INT NOT NULL,
   amount DECIMAL(10, 2) NOT NULL,
   payment_type ENUM('FULL','DOWNPAYMENT') NOT NULL,
   payment_method VARCHAR(50) NOT NULL,
   payment_status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
   remaining_balance DECIMAL(10, 2) NOT NULL,
   payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)

);

ALTER TABLE bookings
ADD FOREIGN KEY (payment_id) REFERENCES payments(payment_id);


