# 🏦 Digital Wallet Backend

A secure and RESTful digital wallet backend built with **Node.js**, **Express.js**, and **PostgreSQL**. It supports user authentication, wallet funding, peer-to-peer payments, product purchases, and currency conversion via an external API.

---

## 📁 Project Structure

```text
digital-wallet-backend/
├── src/
│   └── index.js                # Entry point (used for Vercel)
│
├── routes/
│   ├── auth.js                 # User registration & authentication
│   ├── wallet.js               # Wallet operations (fund, pay, balance, history)
│   ├── purchase.js             # Purchase routes (buy/view)
│   └── product.js              # Product catalog APIs
│
├── config/
│   └── db.js                   # PostgreSQL DB connection setup
│
├── middleware/
│   └── authenticate.js         # Basic Auth middleware
│
├── .env                        # Environment variables
├── .gitignore                  # Ignored files
├── vercel.json                 # Vercel deployment config
├── docker-compose.yml          # Docker service definitions
├── package.json                # NPM dependencies & scripts
├── package-lock.json           # Dependency lock file
└── README.md                   # Project documentation
```

---

## 🚀 Features

* 🔐 Basic Auth with username/password (bcrypt)
* 💰 Fund and manage wallet balance
* 🔄 Pay other users
* 🌍 Real-time currency conversion using [currencyapi.com](https://currencyapi.com)
* 📦 Product catalog (add/list)
* 🛒 Purchase products
* 🧾 Transaction and purchase history

---

## ⚙️ Technologies

* Node.js + Express.js
* PostgreSQL (via Docker)
* bcrypt for password hashing
* pg for PostgreSQL queries
* dotenv for environment configs
* Vercel for deployment

---

## 🧪 API Overview

| Method | Endpoint           | Auth | Description                    |
| ------ | ------------------ | ---- | ------------------------------ |
| POST   | /auth/register     | ❌    | Register a new user            |
| POST   | /wallet/fund       | ✅    | Add funds to wallet            |
| POST   | /wallet/pay        | ✅    | Transfer money to another user |
| GET    | /wallet/bal        | ✅    | Check balance with conversion  |
| GET    | /wallet/stmt       | ✅    | View transaction history       |
| POST   | /product           | ✅    | Add product                    |
| GET    | /product           | ❌    | List all products              |
| POST   | /product/buy       | ✅    | Purchase a product             |
| GET    | /product/purchases | ✅    | List your purchases            |
| DELETE | /product/\:id      | ✅    | (Optional) Delete a product    |

---

## 🐘 PostgreSQL Setup

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  balance INTEGER DEFAULT 0
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  kind TEXT CHECK (kind IN ('credit', 'debit')),
  amt INTEGER,
  updated_bal INTEGER,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT
);

CREATE TABLE purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  purchased_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🐳 Docker Configuration

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    container_name: wallet_postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: yourpassword
      POSTGRES_DB: walletdb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

## 🌐 Environment Variables (.env)

```env
DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/walletdb
CURRENCY_API_KEY=your_currencyapi_key
```

---


## 📤 Deploy to Vercel

1. Connect GitHub repo to Vercel
2. Add `.env` variables in Vercel dashboard
3. Set root to `/src` and entry file to `index.js`
4. Deploy 🚀

---

## 📫 Author

**Asish Ray**
🔗 [GitHub](https://github.com/Asish-Ray)
📧 [Email](mailto:aray19069@gmail.com)