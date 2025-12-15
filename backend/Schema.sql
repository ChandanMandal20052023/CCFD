CREATE DATABASE lms;
USE lms;
CREATE TABLE student(
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(100) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
full_name VARCHAR(200),
email VARCHAR(150) UNIQUE,
role ENUM('student','faculty','admin') DEFAULT 'student',
batch VARCHAR(50),
roll_number VARCHAR(50),
year INT,
cgpa DECIMAL(4,2),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
