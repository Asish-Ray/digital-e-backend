// test-db.js
import pool from './config/db.js';

try {
  const result = await pool.query('SELECT NOW()');
  console.log('✅ Connected to Supabase at:', result.rows[0].now);
} catch (err) {
  console.error('❌ Failed to connect to Supabase:', err.message);
}
