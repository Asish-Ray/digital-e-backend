Here’s a modified version of your `README.md` to reflect your updated setup with **Supabase** instead of local Docker/PostgreSQL:

---

# 🏦 Digital Wallet Backend

A secure and RESTful digital wallet backend built with Node.js, Express.js, PostgreSQL (via **Supabase**), and deployed on **Vercel**. It supports user authentication, wallet funding, peer-to-peer payments, product purchases, and currency conversion via an external API.

---

## 📁 Project Structure

```
digital-wallet-backend/
├── src/                       # Entry point
│   └── index.js
├── routes/                   # Express routers
│   ├── auth.js
│   ├── wallet.js
│   ├── product.js
│   └── purchase.js
├── config/
│   └── db.js                 # Supabase/PostgreSQL DB connection
├── middlewares/
│   └── authenticate.js       # Basic Auth middleware
├── .env                      # Environment variables
├── vercel.json               # Vercel deployment config
├── package.json              # NPM dependencies
├── README.md                 # Project documentation
└── ...
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

## ⚙️ Tech Stack

* Node.js + Express.js
* **Supabase** (PostgreSQL)
* bcrypt for password hashing
* `pg` for SQL queries
* dotenv for env config
* Vercel for deployment

---

## 🔐 Environment Variables (`.env`)

```
DATABASE_URL=your_supabase_postgres_connection_url
CURRENCY_API_KEY=your_currencyapi.com_key
```

> ✅ Make sure you add these in your Vercel project dashboard as well under "Project Settings → Environment Variables".

---

## 🧪 API Endpoints

| Method | Endpoint             | Auth | Description                    |
| ------ | -------------------- | ---- | ------------------------------ |
| POST   | `/auth/register`     | ❌    | Register a new user            |
| POST   | `/wallet/fund`       | ✅    | Add funds to wallet            |
| POST   | `/wallet/pay`        | ✅    | Transfer money to another user |
| GET    | `/wallet/bal`        | ✅    | Check balance (with currency)  |
| GET    | `/wallet/stmt`       | ✅    | View transaction history       |
| POST   | `/product`           | ❌    | Add product                    |
| GET    | `/product`           | ❌    | List all products              |
| POST   | `/product/buy`       | ✅    | Purchase a product             |
| GET    | `/product/purchases` | ✅    | List your purchases            |

---

## 🐘 PostgreSQL Schema (Supabase)

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

## 📦 Deployment

### ➕ Supabase Setup

* Go to [Supabase](https://supabase.com/)
* Create a new project and get the **PostgreSQL connection string**
* Recreate the above tables using SQL editor in Supabase dashboard
* Use the DB URL in `.env` → `DATABASE_URL`

### 🚀 Vercel Deployment

* Push your code to GitHub
* Connect the GitHub repo to [Vercel](https://vercel.com)
* Set environment variables under Project → Settings → Environment Variables:

  * `DATABASE_URL`
  * `CURRENCY_API_KEY`
* Set `build command` to: `npm install`
* Set `output directory` to: leave empty
* Set `root directory`
* Deploy!

> Your deployed backend will be live at: `https://digital-e-backend.vercel.app`

---

## 📫 Author

**Asish Ray**
🔗 [GitHub](https://github.com/Asish-Ray)
📧 [Email](mailto:your.email@example.com)

---
