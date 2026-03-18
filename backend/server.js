require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const seedData = require('./utils/seedData');
const { errorRes } = require('./utils/apiResponse');

// Routes imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./module/user/routes/user');
const providerRoutes = require('./module/serviceprovider/routes/provider');
const publicRoutes = require('./module/user/routes/public');
const leadRoutes = require('./module/user/routes/leads');
const orderRoutes = require('./module/user/routes/orders');
const adminRoutes = require('./module/admin/routes/admin');

// Initialize Express
const app = express();

// Connect Database & Seed
connectDB().then(() => {
  seedData();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome Route
app.get('/', (req, res) => {
  res.send('🏗️ CivilConnect API is running...');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res, next) => {
  return errorRes(res, 'Requested route not found', 404);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return errorRes(res, err.message || 'Internal Server Error', statusCode);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
