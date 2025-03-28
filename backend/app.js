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
import multer from 'multer'; // Add multer for file uploads

const app = express();
const DATABASE_URL = process.env.DATABASE_URL;

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to an 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: JPEG, PNG, PDF, DOC, DOCX'));
    }
  }
});

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

// Apply multer globally or to specific routes (we'll do it in routes)
app.use(express.urlencoded({ extended: true })); // Optional, for form data without files

// Routes
app.use("/api/user", userRoutes);
app.use("/api/gis-registration", upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'workSamples', maxCount: 5 },
  { name: 'certificationFile', maxCount: 1 }
]), gisRegistrationRoutes); // Apply multer to GIS routes

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