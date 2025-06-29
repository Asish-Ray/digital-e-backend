import express from 'express';
import dotenv from 'dotenv';

import { authenticate } from '../middlewares/auth.js';
import authRoutes from '../routes/auth.js';
import walletRoutes from '../routes/wallet.js';
import productRoutes from '../routes/product.js';
import purchaseRoutes from '../routes/purchase.js';
dotenv.config();
const app = express();
app.use(express.json());

// Public Route
app.use('/auth', authRoutes); 
app.use('/product', productRoutes); 

app.use(authenticate);


app.use('/wallet', walletRoutes); 
app.use('/purchase', purchaseRoutes);
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
export default app;