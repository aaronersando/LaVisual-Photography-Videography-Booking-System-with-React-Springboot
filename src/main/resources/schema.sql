CREATE TABLE IF NOT EXISTS our_users (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Auto-increment ID
    email VARCHAR(255) NOT NULL UNIQUE, -- Email must be unique
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    city VARCHAR(255),
    role VARCHAR(50)
);