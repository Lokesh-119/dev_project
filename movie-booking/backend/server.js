const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const movieRoutes = require('./routes/movieRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
// Allows frontend (e.g. http://localhost:5500) to communicate with this backend API
app.use(
  cors({
    origin: '*', // Allow any origin during development / DevOps testing
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Express body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route & Health check endpoint (Ideal for DevOps container / load balancer probes)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🎬 Movie Booking Backend REST API is running!',
    version: '1.0.0',
    endpoints: {
      movies: '/api/movies',
      bookings: '/api/bookings',
      health: '/api/health',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Movie Booking Server running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`===============================================`);
});
