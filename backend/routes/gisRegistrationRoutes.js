import express from "express";
import {
  registerGISMember,
  getGISMemberData,
} from "../controllers/gisRegistrationController.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  validateGISRegistration,
  validateRequest,
} from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  validateGISRegistration,
  validateRequest,
  registerGISMember
);

router.get("/me", protect, getGISMemberData);

export default router;
