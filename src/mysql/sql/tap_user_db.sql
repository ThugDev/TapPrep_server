CREATE TABLE IF NOT EXISTS users (
    user_id          INT AUTO_INCREMENT PRIMARY KEY,
    username       VARCHAR(60) NOT NULL UNIQUE,
    nickname       VARCHAR(60) NOT NULL,
    profile_image  VARCHAR(255) NOT NULL,
    email           VARCHAR(60) NOT NULL,
    role            enum('admin', 'user') DEFAULT 'user',
    create_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS userExps (
    userExp_id      INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    exp             INT NOT NULL DEFAULT 0,
    level           INT NOT NULL DEFAULT 0,
    last_level_up   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    create_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) 
        REFERENCES users (user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
)