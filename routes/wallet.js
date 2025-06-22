import express from 'express';
import pool from '../config/db.js';

const router = express.Router();
//balance 
router.get('/bal', async (req, res) => {
  const userId = req.user.id;
  const currency = req.query.currency?.toUpperCase() || 'INR';

  try {
    const userResult = await pool.query('SELECT balance FROM users WHERE id = $1', [userId]);
    const balanceINR = userResult.rows[0]?.balance || 0;

    if (currency === 'INR') {
      return res.json({ balance: balanceINR, currency: 'INR' });
    }

    const apiKey = process.env.CURRENCY_API_KEY;
    const response = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=INR`);
    const data = await response.json();

    const rate = data.data?.[currency]?.value;
    if (!rate) return res.status(400).json({ error: 'Unsupported currency' });

    const converted = Number((balanceINR * rate).toFixed(2));
    res.json({ balance: converted, currency });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});
// Fund wallet
router.post('/fund', async (req, res) => {
  const { amt } = req.body;
  const userId = req.user.id;

  if (!amt || amt <= 0) return res.status(400).json({ error: 'Invalid amount' });

  try {
    const result = await pool.query(
      'UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING balance',
      [amt, userId]
    );
    await pool.query(
      'INSERT INTO transactions (user_id, kind, amt, updated_bal) VALUES ($1, $2, $3, $4)',
      [userId, 'credit', amt, result.rows[0].balance]
    );
    res.json({ balance: result.rows[0].balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fund wallet' });
  }
});

// Pay another user
router.post('/pay', async (req, res) => {
  const { to, amt } = req.body;
  const sender = req.user;

  if (!to || !amt || amt <= 0) return res.status(400).json({ error: 'Invalid request' });

  try {
    const recipientResult = await pool.query('SELECT * FROM users WHERE username = $1', [to]);
    if (!recipientResult.rows.length) return res.status(400).json({ error: 'Recipient not found' });
    const recipient = recipientResult.rows[0];

    if (sender.balance < amt) return res.status(400).json({ error: 'Insufficient balance' });

    // Deduct from sender
    const newSenderBal = sender.balance - amt;
    await pool.query('UPDATE users SET balance = $1 WHERE id = $2', [newSenderBal, sender.id]);

    // Add to recipient
    const newRecipientBal = recipient.balance + amt;
    await pool.query('UPDATE users SET balance = $1 WHERE id = $2', [newRecipientBal, recipient.id]);

    // Transactions
    await pool.query(
      'INSERT INTO transactions (user_id, kind, amt, updated_bal) VALUES ($1, $2, $3, $4)',
      [sender.id, 'debit', amt, newSenderBal]
    );
    await pool.query(
      'INSERT INTO transactions (user_id, kind, amt, updated_bal) VALUES ($1, $2, $3, $4)',
      [recipient.id, 'credit', amt, newRecipientBal]
    );

    res.json({ balance: newSenderBal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Transaction failed' });
  }
});
router.get('/stmt', async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT kind, amt, updated_bal, timestamp FROM transactions WHERE user_id = $1 ORDER BY timestamp DESC',
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});
export default router;
