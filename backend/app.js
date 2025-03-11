import dotenv from 'dotenv'
dotenv.config()
console.log("JWT_SECRET from .env:", process.env.JWT_SECRET);
import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectdb.js'
import passport from 'passport';
import userRoutes from './routes/userRoutes.js'
import gisRegistrationRoutes from "./routes/gisRegistrationRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import './config/passport-jwt-strategy.js'


const app = express()
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL;


// // This will solve CORS Policy Error
// const corsOptions = {
//   // set origin to a specific origin.
//   origin: process.env.FRONTEND_HOST,
//   credentials: true,
//   optionsSuccessStatus: 200,
// };

const corsOptions = {
  origin: process.env.FRONTEND_HOST || "http://localhost:3000",  // Allow frontend host
  credentials: true,  // Allow cookies and authentication headers
  methods: ["GET", "POST", "PUT", "DELETE"],  // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"],  // Allowed headers
  optionsSuccessStatus: 200,  // Fix some CORS issues in legacy browsers
};

app.use(cors(corsOptions))



// Database Connection
connectDB(DATABASE_URL)

// JSON
app.use(express.json())

//handle url-encoded data

app.use(express.urlencoded({ extended: true }));

// Passport Middleware
app.use(passport.initialize());

// Cookie Parser
app.use(cookieParser())

// Load Routes
app.use("/api/user", userRoutes)
app.use("/api/gis-registration", gisRegistrationRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})