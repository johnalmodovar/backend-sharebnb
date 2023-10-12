CREATE TABLE users (
    username VARCHAR(20) PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    phone VARCHAR(20)
);

CREATE TABLE listings(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    availability BOOLEAN NOT NULL DEFAULT FALSE,
    price INTEGER NOT NULL CHECK (price >= 0),
    listed_by VARCHAR(20) NOT NULL
        REFERENCES users ON DELETE CASCADE
);