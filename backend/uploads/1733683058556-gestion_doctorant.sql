CREATE DATABASE gestion_doctorants;
USE gestion_doctorants;
CREATE TABLE doctorants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    statut VARCHAR(50),
    date_fin_predite DATE,
    sujet_these TEXT
);
INSERT INTO doctorants (nom, prenom, statut, date_fin_predite, sujet_these)
VALUES
('Doe', 'John', 'Actif', '2026-12-01', 'Intelligence artificielle dans la santé'),
('Smith', 'Jane', 'Suspendu', '2025-06-15', 'Blockchain et gestion des données');

-- Création de la table theses
CREATE TABLE theses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    sujet TEXT,
    date_debut DATE,
    date_soutenance DATE,
    doctorant_id INT,
    FOREIGN KEY (doctorant_id) REFERENCES doctorants(id) ON DELETE CASCADE
);
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'doctorant') NOT NULL
);

INSERT INTO users (email, password, role) VALUES
('admin@phd.com', '$2b$10$ko8NU2y3s5IqU7djwMC44.i.MKzEuQ4gZeMANi3lieLfV5QnVmpOq', 'admin');
DELETE FROM users WHERE id = 2;
ALTER TABLE doctorants
ADD COLUMN user_id INT,
ADD FOREIGN KEY (user_id) REFERENCES users(id);
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
insert into theses values(id, 'computer sciencesdfdsfsdfsdf', "dsjjfkldsjfsdfsdfsdfdsfdsfdsfsdf", '2024-01-01', '2024-01-01', 1);
SELECT COUNT(id) FROM doctorants;