
import dotenv from 'dotenv';
dotenv.config();

// Environment variable checks
const requiredEnvVars = [
  'JWT_ACCESS_TOKEN_SECRET_KEY',
  'DATABASE_URL'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.warn(`⚠️ Warning: ${envVar} is not set in .env!`);
  }
});

const port = process.env.PORT || 8000;

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectdb.js';
import passport from 'passport';
import userRoutes from './routes/userRoutes.js';
import gisRegistrationRoutes from './routes/gisRegistrationRoutes.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import './config/passport-jwt-strategy.js';

const app = express();
const DATABASE_URL = process.env.DATABASE_URL;

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_HOST || "http://localhost:3000",
  credentials: true
}));

// Database Connection
connectDB(DATABASE_URL);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/gis-registration", gisRegistrationRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error Handling
app.use(errorHandler);

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});