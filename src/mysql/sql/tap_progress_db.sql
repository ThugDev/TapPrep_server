CREATE TABLE IF NOT EXISTS progresses (
    progress_id      INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT NOT NULL,
    problem_id       INT NOT NULL UNIQUE,
    type             INT NOT NULL,
    isCorrect        BOOLEAN NOT NULL,
    optionData           VARCHAR(60) NOT NULL,
    create_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) 
        REFERENCES users (user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (problem_id) 
        REFERENCES problems (problem_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);