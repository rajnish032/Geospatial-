import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import createError from "http-errors";

dotenv.config();

const verifyJWT = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw createError(401, "Token expired, please log in again");
    }
    if (error.name === "JsonWebTokenError") {
      throw createError(401, "Invalid token");
    }
    throw createError(401, "Token verification failed");
  }
};

export const protect = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("Incoming Authorization Header:", req.headers.authorization);
      console.log("Incoming Cookies:", req.cookies);
    }

    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw createError(401, "Not authorized, no token provided");
    }

    const decoded = verifyJWT(token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY);

    if (process.env.NODE_ENV === "development") {
      console.log("Decoded token payload:", decoded);
    }

    const user = await User.findById(decoded._id).select("-password -refreshToken");
    if (!user) {
      throw createError(401, "User not found, authorization denied");
    }

    req.user = user;
    next();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Authentication Error:", {
        message: error.message,
        stack: error.stack,
        token: req.headers.authorization || req.cookies?.accessToken,
      });
    }

    res.status(error.status || 500).json({
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === "development" && { error: error.stack }),
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw createError(401, "Authentication required");
      }
      // Check if any of the user's roles match the required roles
      const userRoles = req.user.roles || ["user"]; // Default to "user" if roles is undefined
      if (!roles.some((role) => userRoles.includes(role))) {
        throw createError(403, `User roles ${userRoles.join(", ")} are not authorized to access this route`);
      }
      next();
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
        ...(process.env.NODE_ENV === "development" && { error: error.stack }),
      });
    }
  };
};

export const verifyRefresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createError(401, "No refresh token provided");
    }

    const decoded = verifyJWT(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET_KEY);
    const user = await User.findById(decoded._id);

    if (!user) {
      throw createError(403, "User not found for this refresh token");
    }
    // Check if refreshToken exists in user document (optional in schema)
    if (user.refreshToken && user.refreshToken !== refreshToken) {
      throw createError(403, "Invalid refresh token");
    }

    req.user = user;
    next();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Refresh Token Error:", {
        message: error.message,
        stack: error.stack,
      });
    }

    res.status(error.status || 500).json({
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === "development" && { error: error.stack }),
    });
  }
};