import auth from 'basic-auth';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';

export async function authenticate(req, res, next) {
  const credentials = auth(req);
  if (!credentials) return res.status(401).json({ error: 'Auth required' });

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [credentials.name]
    );

    if (!result.rows.length) return res.status(401).json({ error: 'Invalid user' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(credentials.pass, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Auth error' });
  }
}
