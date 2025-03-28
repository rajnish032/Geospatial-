import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from 'dotenv';
import createError from 'http-errors';

dotenv.config();

// Enhanced JWT verification function
const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw createError(401, 'Token expired, please log in again');
    }
    throw createError(401, 'Invalid token');
  }
};

export const protect = async (req, res, next) => {
  // Debugging logs only in development
  if (process.env.NODE_ENV === 'development') {
    console.log("Incoming Authorization Header:", req.headers.authorization);
  }

  let token;

  // Check for token in multiple locations
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    if (process.env.NODE_ENV === 'development') {
      console.log("No token found in request");
    }
    return next(createError(401, 'Not authorized, no token provided'));
  }

  try {
    // Verify token
    const decoded = verifyJWT(token);
    
    if (process.env.NODE_ENV === 'development') {
      console.log("Decoded token payload:", decoded);
    }

    // Get user and attach to request
    const user = await User.findById(decoded._id).select("-password -refreshToken");
    
    if (!user) {
      return next(createError(401, 'User not found, authorization denied'));
    }

    // // Check if user is active
    // if (!user.isActive) {
    //   return next(createError(403, 'User account is inactive'));
    // }

    // Attach user to request
    req.user = user;
    
    // Proceed to next middleware
    next();
  } catch (error) {
    // Enhanced error logging
    if (process.env.NODE_ENV === 'development') {
      console.error("Authentication Error:", {
        error: error.message,
        stack: error.stack,
        token: token
      });
    }

    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return next(createError(401, 'Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(createError(401, 'Token expired, please log in again'));
    }

    // Pass other errors to error handler
    next(error);
  }
};

// Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        createError(403, `User role ${req.user.role} is not authorized to access this route`)
      );
    }
    next();
  };
};

// Optional: Token refresh verification middleware
export const verifyRefresh = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  
  if (!refreshToken) {
    return next(createError(401, 'No refresh token provided'));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET_KEY);
    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== refreshToken) {
      return next(createError(403, 'Invalid refresh token'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(createError(401, 'Invalid refresh token'));
  }
};