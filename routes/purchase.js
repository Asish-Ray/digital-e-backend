
import express from 'express';
import pool from '../config/db.js';

const router = express.Router();


router.get('/purchases', async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(`
      SELECT 
        p.id AS purchase_id,
        pr.name AS product_name,
        pr.price,
        pr.description,
        p.purchased_at
      FROM purchases p
      JOIN products pr ON p.product_id = pr.id
      WHERE p.user_id = $1
      ORDER BY p.purchased_at 
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error('FETCH PURCHASES ERROR:', err.stack || err.message);

    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
});



// Buy 
router.post('/buy', async (req, res) => {
  const { product_id } = req.body;
  const user = req.user;

  if (!product_id) return res.status(400).json({ error: 'Product ID required' });

  try {
    const productRes = await pool.query('SELECT * FROM products WHERE id = $1', [product_id]);
    if (!productRes.rows.length) return res.status(400).json({ error: 'Invalid product' });

    const product = productRes.rows[0];
    if (user.balance < product.price) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const newBal = user.balance - product.price;
    await pool.query('UPDATE users SET balance = $1 WHERE id = $2', [newBal, user.id]);
    await pool.query(
   
        'INSERT INTO transactions (user_id, kind, amt, updated_bal) VALUES ($1, $2, $3, $4)',
      [user.id, 'debit', product.price, newBal]
    );
      // To add pur tab
    await pool.query(
      'INSERT INTO purchases (user_id, product_id) VALUES ($1, $2)',
      [user.id, product.id]
    );

    res.json({ message: 'Product purchased', balance: newBal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Purchase failed' });
  }
});
// Delete a prod
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
   
    const check = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete the product
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('DELETE PRODUCT ERROR:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});


export default router;
