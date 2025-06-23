import express from 'express';
import pool from '../config/db.js';

const router = express.Router();


router.post('/add', async (req, res) => {
  const { name, price, description } = req.body;

  if (!name || !price || price <= 0 || !description) {
    return res.status(400).json({ error: 'Invalid product details' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING id',
      [name, price, description]
    );

    res.status(201).json({
      id: result.rows[0].id,
      message: 'Product added'
    });
  } catch (err) {
    console.error('Add Product Error:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});
// List all products (GET /product)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

export default router;
