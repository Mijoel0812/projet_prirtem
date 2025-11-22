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

-- Table Profils (Liée à l'utilisateur connecté)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(150),
    phone VARCHAR(20),
    address TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Véhicules
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    fuel_type VARCHAR(20) CHECK (fuel_type IN ('Essence', 'Diesel', 'Hybride', 'Electrique')),
    status VARCHAR(20) DEFAULT 'Disponible', -- Disponible, En maintenance, En mission
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Chauffeurs
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);