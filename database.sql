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

-- CREATE TABLE added_by (
--     user_id UUID NOT NULL,   
--     added_by UUID NOT NULL, 
--     added_at TIMESTAMP NOT NULL, 
--     FOREIGN KEY (user_id) REFERENCES users(id), 
--     FOREIGN KEY (added_by) REFERENCES users(id), 
--     UNIQUE (user_id, added_by)
-- );
   

-- CREATE TABLE friends (
--     user_id UUID NOT NULL, 
--     friend_id UUID NOT NULL, 
--     created_at TIMESTAMP NOT NULL, 
--     FOREIGN KEY (user_id) REFERENCES users(id),
--     FOREIGN KEY (friend_id) REFERENCES users(id), 
--     UNIQUE (user_id, friend_id)
-- );

-- CREATE TABLE chats (
--     chat_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
--     friend_one_id UUID NOT NULL, 
--     friend_two_id UUID NOT NULL, 
--     FOREIGN KEY (friend_one_id) REFERENCES users(id), 
--     FOREIGN KEY (friend_two_id) REFERENCES users(id), 
--     UNIQUE (friend_one_id, friend_two_id)
-- );

-- CREATE TABLE shared_with_you (
--     chat_id UUID NOT NULL, 
--     sent_by_id UUID,
--     message VARCHAR, 
--     link VARCHAR, 
--     photo VARCHAR, 
--     FOREIGN KEY (chat_id) REFERENCES chats(chat_id), 
--     FOREIGN KEY (sent_by_id) REFERENCES users(id)
-- );