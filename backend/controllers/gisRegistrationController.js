import GISMember from "../models/GISMemberRegistration.js";
import UserModel from "../models/User.js";
import { validationResult, check } from "express-validator";
import mongoose from "mongoose";

// ✅ Middleware: GIS Registration Validation Rules
export const validateGISRegistration = [
  check("fullName").notEmpty().withMessage("Full Name is required"),
  check("dob").notEmpty().withMessage("Date of Birth is required"),
  check("gender").isIn(["Male", "Female", "Other"]).withMessage("Invalid gender"),
  check("contactNumber").matches(/^\d{10}$/).withMessage("Invalid contact number"),
  check("email").isEmail().withMessage("Invalid email format"),
  check("institution").notEmpty().withMessage("Institution is required"),
  check("fieldOfStudy").notEmpty().withMessage("Field of Study is required"),
];

// @desc    Register GIS Member
// @route   POST /api/gis-registration
// @access  Private
export const registerGISMember = async (req, res) => {
  try {
    // ✅ Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: Please log in first" });
    }

    // ✅ Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const {
      fullName, dob, gender, contactNumber, email, address,
      education, institution, fieldOfStudy, experience, employer, jobTitle,
      skills, workMode, workType, workHours,
      linkedIn, portfolio, certifications, additionalInfo
    } = req.body;

    // ✅ Check if user has already registered GIS form
    const existingMember = await GISMember.findOne({ user: req.user._id });
    if (existingMember) {
      return res.status(400).json({ message: "GIS Registration already completed" });
    }

    // ✅ Use transaction for atomic operation
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // ✅ Save new GIS Member
      const newMember = new GISMember({
        user: req.user._id,
        fullName, dob, gender, contactNumber, email, address,
        education, institution, fieldOfStudy, experience, employer, jobTitle,
        skills, workMode, workType, workHours,
        linkedIn, portfolio, certifications, additionalInfo
      });

      await newMember.save({ session });

      // ✅ Update `isGISRegistered` to `true` in User Model
      await UserModel.findByIdAndUpdate(req.user._id, { isGISRegistered: true }, { session });

      await session.commitTransaction();
      session.endSession();

      // ✅ Send response for frontend redirection
      res.status(201).json({
        message: "GIS Registration successful! Redirecting to profile...",
        redirectTo: "user/profile",
        memberId: newMember._id,
      });

    } catch (transactionError) {
      await session.abortTransaction();
      session.endSession();
      throw transactionError;
    }

  } catch (error) {
    console.error("Error in GIS Registration:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// @desc    Get GIS Member Data
// @route   GET /api/gis-registration/me
// @access  Private
export const getGISMemberData = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: Please log in first" });
    }

    const memberData = await GISMember.findOne({ user: req.user._id });

    if (!memberData) {
      return res.status(404).json({ message: "GIS Registration not found" });
    }

    res.status(200).json(memberData);
  } catch (error) {
    console.error("Error fetching GIS data:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// @desc    Update GIS Member Data
// @route   PUT /api/gis-registration/me
// @access  Private
export const updateGISMemberData = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: Please log in first" });
    }

    const memberData = await GISMember.findOneAndUpdate(
      { user: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!memberData) {
      return res.status(404).json({ message: "GIS Registration not found" });
    }

    res.status(200).json({
      message: "GIS Data updated successfully!",
      memberData
    });
  } catch (error) {
    console.error("Error updating GIS data:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



