CREATE TABLE IF NOT EXISTS users (
    user_id          INT AUTO_INCREMENT PRIMARY KEY,
    username       VARCHAR(60) NOT NULL UNIQUE,
    nickname       VARCHAR(60) NOT NULL,
    profile_image  VARCHAR(255) NOT NULL,
    email           VARCHAR(60) NOT NULL,
    level           INT DEFAULT 1,
    role            enum('admin', 'user') DEFAULT 'user',
    create_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);