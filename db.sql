-- USERS table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  balance NUMERIC DEFAULT 0
);

-- TRANSACTIONS table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  kind TEXT CHECK (kind IN ('credit', 'debit')),
  amt NUMERIC NOT NULL,
  updated_bal NUMERIC NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT
);

-- PURCHASES table (optional for tracking who bought what)
CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);