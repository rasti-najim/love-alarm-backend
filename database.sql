-- CREATE DATABASE love_alarm;

-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CREATE TABLE users (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     username VARCHAR(255) UNIQUE NOT NULL,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     password VARCHAR(255) NOT NULL
-- );

-- ALTER TABLE users
-- ADD COLUMN birth_date DATE NOT NULL DEFAULT CURRENT_DATE;