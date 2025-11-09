const express = require('express');
const app = express();
const path = require('path');
const User = require('./models/User');
require('./config/database');
require('./utils/validate');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const authUser = require('./Middlewares/auth');
const authRouter = require('./routes/auth');
const profileRouter = require('./Middlewares/profile');
const requestRouter = require('./routes/requests');
const userRouter = require('./routes/user');
const cors = require('cors');

// ✅ Allowed origins for local + deployed frontend
const allowedOrigins = [
  'http://localhost:5173',
  'https://devships.vercel.app',
  'http://13.200.70.24'
];

// ✅ Dynamic CORS configuration
if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, origin);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
} else {
  app.use(
    cors({
      origin: ['https://devships.vercel.app', 'http://13.200.70.24'], // Restrict to your prod frontends
      credentials: true,
    })
  );
}

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Add a root route for testing server availability
app.get('/', (req, res) => {
  res.send('✅ DevShips Backend is running successfully!');
});

// ✅ API Routes
app.use('/api', authRouter);
app.use('/api', profileRouter);
app.use('/api', requestRouter);
app.use('/api', userRouter);

// ✅ Serve frontend (React build) in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });
}

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;