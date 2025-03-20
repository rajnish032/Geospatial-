// import dotenv from 'dotenv'
// dotenv.config()
// console.log("JWT_SECRET from .env:", process.env.JWT_SECRET);
// import express from 'express'
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import connectDB from './config/connectdb.js'
// import passport from 'passport';
// import userRoutes from './routes/userRoutes.js'
// import gisRegistrationRoutes from "./routes/gisRegistrationRoutes.js";
// import { errorHandler } from "./middlewares/errorMiddleware.js";
// import './config/passport-jwt-strategy.js'


// const app = express()
// const port = process.env.PORT
// const DATABASE_URL = process.env.DATABASE_URL;


// // // This will solve CORS Policy Error
// // const corsOptions = {
// //   // set origin to a specific origin.
// //   origin: process.env.FRONTEND_HOST,
// //   credentials: true,
// //   optionsSuccessStatus: 200,
// // };

// const corsOptions = {
//   origin: process.env.FRONTEND_HOST || "http://localhost:3000",  // Allow frontend host
//   credentials: true,  // Allow cookies and authentication headers
//   methods: ["GET", "POST", "PUT", "DELETE"],  // Allowed HTTP methods
//   allowedHeaders: ["Content-Type", "Authorization"],  // Allowed headers
//   optionsSuccessStatus: 200,  // Fix some CORS issues in legacy browsers
// };

// app.use(cors(corsOptions))



// // Database Connection
// connectDB(DATABASE_URL)

// // JSON
// app.use(express.json())

// //handle url-encoded data

// app.use(express.urlencoded({ extended: true }));

// // Passport Middleware
// app.use(passport.initialize());

// // Cookie Parser
// app.use(cookieParser())

// // Load Routes
// app.use("/api/user", userRoutes)
// app.use("/api/gis-registration", gisRegistrationRoutes);

// app.use(errorHandler);

// app.listen(port, () => {
//   console.log(`Server listening at http://localhost:${port}`)
// })

import dotenv from 'dotenv';
dotenv.config();

// Check if essential environment variables are set
if (!process.env.JWT_ACCESS_TOKEN_SECRET_KEY) {
  console.warn("⚠️ Warning: JWT_ACCESS_TOKEN_SECRET_KEY is not set in .env!");
}
if (!process.env.DATABASE_URL) {
  console.warn("⚠️ Warning: DATABASE_URL is not set in .env!");
}
if (!process.env.PORT) {
  console.warn("⚠️ Warning: PORT is not set in .env! Using default port 8000.");
}

// Logging 
console.log("✅ JWT_ACCESS_TOKEN_SECRET_KEY Loaded");
console.log("✅ Database URL:", process.env.DATABASE_URL);

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
const port = process.env.PORT || 8000; // Default to 8000 if not set
const DATABASE_URL = process.env.DATABASE_URL;

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_HOST || "http://localhost:3000", // Allow frontend host
  credentials: true, // Allow cookies and authentication headers
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  optionsSuccessStatus: 200, // Fix some CORS issues in legacy browsers
};

app.use(cors(corsOptions));

// Database Connection
connectDB(DATABASE_URL);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/gis-registration", gisRegistrationRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
