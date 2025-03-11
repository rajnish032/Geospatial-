import express from "express";
import { registerGISMember, getGISMemberData } from "../controllers/gisRegistrationController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateGISRegistration, validateRequest } from "../middlewares/validationMiddleware.js"; // Fix import

const router = express.Router();

// @route   POST /api/gis-registration
// @desc    Register GIS Member
// @access  Private
router.post("/", protect, validateGISRegistration, validateRequest, registerGISMember);

// @route   GET /api/gis-registration/me
// @desc    Get GIS Member Data
// @access  Private
router.get("/me", protect, getGISMemberData);

export default router;


