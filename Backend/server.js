import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.route.js';
import vendorRoutes from './routes/vendor.route.js';
import quotationRoutes from './routes/quotation.route.js';
import dashboardRoutes from './routes/dashboard.route.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';
import vendorAuthRoutes from './routes/vendorAuth.routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());




// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('Vendor Management & Quotation System API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/vendor-auth', vendorAuthRoutes);

// Error handling (always last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});