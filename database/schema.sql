-- MySQL schema for the PhD management app (tables only, no data)
CREATE DATABASE IF NOT EXISTS gestion_doctorants;
USE gestion_doctorants;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'doctorant') NOT NULL
);

CREATE TABLE doctorants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    statut VARCHAR(50),
    date_fin_predite DATE,
    sujet_these TEXT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE theses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    sujet TEXT,
    date_debut DATE,
    date_soutenance DATE,
    doctorant_id INT,
    FOREIGN KEY (doctorant_id) REFERENCES doctorants(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL,
    doctorant_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctorant_id) REFERENCES doctorants(id)
);

CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctorant_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctorant_id) REFERENCES doctorants(id)
);
