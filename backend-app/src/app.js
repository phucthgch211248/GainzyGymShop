const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./modules/auth/routes/authRoutes');
const userRoutes = require('./modules/user/routes/userRoutes');
const categoryRoutes = require('./modules/category/routes/categoryRoutes');
const productRoutes = require('./modules/product/routes/productRoutes');
const cartRoutes = require('./modules/cart/routes/cartRoutes');
const orderRoutes = require('./modules/order/routes/orderRoutes');
const reviewRoutes = require('./modules/review/routes/reviewRoutes');
const adminRoutes = require('./modules/admin/routes/adminRoutes');
const brandRoutes = require('./modules/brand/routes/brandRoutes');
const blogRoutes = require('./modules/blog/routes/blogRoutes');
const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL,
    ...(process.env.FRONTEND_URLS ? process.env.FRONTEND_URLS.split(',') : [])
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/blogs', blogRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running' 
  });
});

app.use(errorHandler);

module.exports = app;