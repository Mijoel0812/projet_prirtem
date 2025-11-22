psql -U postgres -h localhost -p 5432 -d prirtem_db

-- Créez d'abord la base de données (si elle n'existe pas)
CREATE DATABASE prirtem_db;

-- Connectez-vous à la base de données 'prirtem_db' avant d'exécuter la suite
\c prirtem_db

-- Activer l'extension pour générer des UUID (meilleur pour les ID)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Créer la table des utilisateurs
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);