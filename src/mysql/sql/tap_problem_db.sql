CREATE TABLE IF NOT EXISTS sectors (
    sector_id          INT AUTO_INCREMENT PRIMARY KEY,
    sector_name       VARCHAR(60) NOT NULL UNIQUE,
    create_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS problems (
    problem_id      INT AUTO_INCREMENT PRIMARY KEY,
    sector_id       INT NOT NULL,
    type            INT NOT NULL,
    difficulty      INT NOT NULL,
    title           VARCHAR(100) NOT NULL,
    description     VARCHAR(150) NOT NULL,
    hint            VARCHAR(60) NOT NULL,
    explanation     TEXT NOT NULL,
    reference       VARCHAR(255) NOT NULL,
    create_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sector_id) 
        REFERENCES sectors (sector_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS options (
    option_id        INT AUTO_INCREMENT PRIMARY KEY,
    problem_id       INT NOT NULL,
    type             INT NOT NULL,
    option_text      VARCHAR(60) NOT NULL,
    isCorrect        BOOLEAN NOT NULL,
    create_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (problem_id) 
        REFERENCES problems (problem_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);