// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import dotenv from 'dotenv';

// dotenv.config(); // Load environment variables

// export const protect = async (req, res, next) => {
//     console.log("JWT Secret:", process.env.JWT_ACCESS_TOKEN_SECRET_KEY); // Debugging log
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//         try {
//             token = req.headers.authorization.split(" ")[1];
//             console.log("Extracted token:", token); // Debugging log

//             // Use the correct JWT secret key from .env
//             const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY);
//             console.log("Decoded token:", decoded);

//             req.user = await User.findById(decoded._id).select("-password");

//             if (!req.user) {
//                 return res.status(401).json({ status: "failed", message: "User not found, authorization denied" });
//             }

//             next();
//         } catch (error) {
//             console.log("JWT Error:", error.message);

//             if (error.name === "TokenExpiredError") {
//                 return res.status(401).json({ status: "failed", message: "Token expired, please log in again" });
//             }

//             return res.status(401).json({ status: "failed", message: "Invalid token" });
//         }
//     } else {
//         console.log("No Authorization header received!");
//         return res.status(401).json({ status: "failed", message: "No token, authorization denied" });
//     }
// };

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from 'dotenv';

dotenv.config();

export const protect = async (req, res, next) => {
    console.log("JWT Secret:", process.env.JWT_ACCESS_TOKEN_SECRET_KEY); // Debugging log
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            console.log("Extracted token:", token); // Debugging log

            // Use correct JWT secret key
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY);
            console.log("Decoded token:", decoded);

            req.user = await User.findById(decoded._id).select("-password");

            if (!req.user) {
                return res.status(401).json({ status: "failed", message: "User not found, authorization denied" });
            }

            next();
        } catch (error) {
            console.log("JWT Error:", error.message);
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ status: "failed", message: "Token expired, please log in again" });
            }

            return res.status(401).json({ status: "failed", message: "Invalid token" });
        }
    } else {
        console.log("No Authorization header received!");
        return res.status(401).json({ status: "failed", message: "No token, authorization denied" });
    }
};

