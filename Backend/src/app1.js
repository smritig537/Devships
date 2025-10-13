const express = require('express');
const app = express();
const path = require('path'); // Added: Need path module for file serving
const User = require('./models/User');
require('./config/database');
require('./utils/validate');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const authUser = require('./Middlewares/auth');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');
const userRouter = require('./routes/user');
const cors = require('cors');

// Define allowed origins for DEVELOPMENT and DECOUPLED PRODUCTION
const allowedOrigins = ['http://localhost:5173', 'https://devships.vercel.app','http://13.200.70.24'];

// Use a dynamic origin configuration for development or decoupled deployment, 
// and a simplified wildcard ONLY if not sending credentials, but since you are, 
// we must use the whitelist logic for non-production environments.
if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, origin);
        } else {
          // You can also allow the deployed Render URL if running decoupled
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true, // This is why '*' is forbidden
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
} else {
  // In a unified deployment (Render), the frontend and backend share the same domain (e.g., devships.onrender.com).
  // The static file serving logic below handles the frontend, and the API calls are same-origin.
  // We can still use a simplified CORS setup or rely on same-origin policies.
  app.use(cors({
    origin: '*', // Simplified, but might not strictly be needed if only serving static files.
    credentials: true, // Keep credentials true for same-origin requests
  }));
}

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- PRODUCTION STATIC FILE SERVING LOGIC (CRUCIAL) ---
// This tells Express to serve the built React files when the app is running on the cloud.
if (process.env.NODE_ENV === 'production') {
  // 1. Set the static folder to the built frontend files
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist'))); 

  // 2. Serve index.html for all non-API routes ('*')
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });
}
// -----------------------------------------------------

// API Routes
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

// Use process.env.PORT for dynamic cloud hosting ports, fallback to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
