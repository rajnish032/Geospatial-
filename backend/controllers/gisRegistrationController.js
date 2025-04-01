import GISMember from "../models/GISMemberRegistration.js";
import fs from "fs/promises"; // Use promises for cleaner async file operations
import UserModel from "../models/User.js";
import { validationResult, check } from "express-validator";
import mongoose from "mongoose";

// Validation middleware for GIS registration
export const validateGISRegistration = [
  check("fullName").notEmpty().withMessage("Full Name is required"),
  check("dob").notEmpty().withMessage("Date of Birth is required"),
  check("gender")
    .isIn(["Male", "Female", "Other", "Prefer not to say"])
    .withMessage("Invalid gender"),
  check("contactNumber")
    .matches(/^\d{10}$/)
    .withMessage("Invalid contact number (must be 10 digits)"),
  check("email").isEmail().withMessage("Invalid email format"),
  check("address").notEmpty().withMessage("Address is required"),
  check("pinCode")
    .matches(/^\d{6}$/)
    .withMessage("Invalid pin code (must be 6 digits)"),
  check("city").notEmpty().withMessage("City is required"),
  check("state").notEmpty().withMessage("State is required"),
  check("institution").notEmpty().withMessage("Institution is required"),
  check("fieldOfStudy").notEmpty().withMessage("Field of Study is required"),
  check("projects")
    .isArray({ min: 3 })
    .withMessage("At least 3 projects are required"),
  check("projects.*.title").notEmpty().withMessage("Project title is required"),
  check("projects.*.description")
    .notEmpty()
    .withMessage("Project description is required"),
  check("acceptTerms")
    .custom((value) => value === "true" || value === true)
    .withMessage("You must accept the terms"),
  check("availableEquipment.*")
    .optional()
    .isIn([
      "GPS Receiver",
      "Total Station",
      "Drone/UAV",
      "3D Scanner",
      "Survey Grade Tablet",
      "Laser Distance Meter",
      "Other",
    ])
    .withMessage("Invalid equipment value"),
];

// Register a new GIS member
export const registerGISMember = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const userId = req.user?._id;
    if (!userId) {
      throw new Error("Unauthorized: Please log in first");
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    // Parse availableEquipment from FormData
    const availableEquipment = Object.keys(req.body)
      .filter((key) => key.startsWith("availableEquipment["))
      .map((key) => req.body[key].trim())
      .filter(Boolean);

    const filePaths = {
      profileImage: req.files?.profileImage?.[0]?.path,
      workSamples: req.files?.workSamples?.map((f) => f.path),
      certificationFile: req.files?.certificationFile?.[0]?.path,
    };

    // Check for existing non-draft registration
    const existing = await GISMember.findOne({
      user: userId,
      isDraft: false,
    }).session(session);
    if (existing) {
      throw new Error("GIS Registration already completed");
    }

    // Clean and prepare member data
    const memberData = {
      ...req.body,
      availableEquipment,
      ...filePaths,
      isDraft: false,
      submittedAt: new Date(),
      user: userId,
    };
    ["_id", ...Object.keys(req.body).filter((k) => k.startsWith("availableEquipment["))].forEach(
      (key) => delete memberData[key]
    );

    // Update draft or create new
    let newMember;
    const draft = await GISMember.findOne({ user: userId, isDraft: true }).session(session);
    if (draft) {
      newMember = await GISMember.findOneAndUpdate(
        { user: userId, isDraft: true },
        { $set: memberData },
        { new: true, session }
      );
    } else {
      newMember = await GISMember.create(memberData, { session });
    }

    await UserModel.findByIdAndUpdate(
      userId,
      { isGISRegistered: true },
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        memberId: newMember._id,
        redirectTo: "/user/profile",
      },
    });
  } catch (error) {
    await session.abortTransaction();

    if (req.files) {
      await Promise.all(
        Object.values(req.files)
          .flat()
          .map((file) => fs.unlink(file.path).catch((err) => console.error("File cleanup error:", err)))
      );
    }

    const status = {
      Unauthorized: 401,
      Validation: 400,
      already: 409,
    }[error.message.split(" ")[0]] || 500;

    res.status(status).json({
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === "development" && { error: error.stack }),
    });
  } finally {
    session.endSession();
  }
};

// Update GIS member data
export const updateGISMemberData = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Please log in first",
      });
    }

    // Parse savedTabs from FormData
    const savedTabs = Object.keys(req.body)
      .filter((key) => key.startsWith("savedTabs["))
      .map((key) => parseInt(req.body[key]))
      .filter((num) => !isNaN(num));

    const updates = {
      ...req.body,
      ...(savedTabs.length > 0 && { savedTabs }),
      ...(req.files?.profileImage && { profileImage: req.files.profileImage[0].path }),
      ...(req.files?.workSamples && { workSamples: req.files.workSamples.map((file) => file.path) }),
      ...(req.files?.certificationFile && {
        certificationFile: req.files.certificationFile[0].path,
      }),
    };
    Object.keys(updates).forEach((key) => {
      if (key.startsWith("savedTabs[")) delete updates[key];
    });

    const memberData = await GISMember.findOneAndUpdate(
      { user: userId },
      { $set: updates },
      {
        new: true,
        runValidators: true,
        select: "-__v -createdAt -updatedAt",
      }
    );

    if (!memberData) {
      return res.status(404).json({
        success: false,
        message: "GIS Registration not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "GIS Data updated successfully",
      data: memberData,
    });
  } catch (error) {
    console.error("Error updating GIS data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update GIS data",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Check for existing draft
export const checkForDraft = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Please log in first",
      });
    }

    const draft = await GISMember.findOne({
      user: userId,
      isDraft: true,
    }).select("-__v -createdAt -updatedAt");

    res.status(200).json({
      success: true,
      exists: !!draft,
      draftData: draft || null,
    });
  } catch (error) {
    console.error("Error checking for draft:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check for draft",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Save draft
export const saveDraft = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const userId = req.user?._id;
    if (!userId) {
      throw new Error("Unauthorized: Please log in first");
    }

    // Parse savedTabs
    const savedTabs = Object.keys(req.body)
      .filter((key) => key.startsWith("savedTabs["))
      .map((key) => parseInt(req.body[key]))
      .filter((num) => !isNaN(num));
    const activeTab = parseInt(req.body.activeTab) || 1;
    if (!savedTabs.includes(activeTab)) savedTabs.push(activeTab);

    // Parse projects
    const projects = [];
    Object.keys(req.body)
      .filter((k) => k.startsWith("projects["))
      .forEach((key) => {
        const match = key.match(/projects\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const index = parseInt(match[1]);
          const field = match[2];
          projects[index] = projects[index] || {};
          projects[index][field] = req.body[key];
        }
      });

    // File updates
    const fileUpdates = {
      ...(req.files?.profileImage && { profileImage: req.files.profileImage[0].path }),
      ...(req.files?.workSamples && { workSamples: req.files.workSamples.map((file) => file.path) }),
      ...(req.files?.certificationFile && {
        certificationFile: req.files.certificationFile[0].path,
      }),
    };

    if (fileUpdates.profileImage) {
      const old = await GISMember.findOne({ user: userId }).select("profileImage");
      if (old?.profileImage) await fs.unlink(old.profileImage).catch(() => {});
    }

    // Prepare update data
    const updateData = {
      ...req.body,
      savedTabs,
      projects: projects.filter((p) => p?.title),
      lastSavedTab: activeTab,
      isDraft: req.body.isDraft !== "false", // Handle string "true"/"false" or boolean
      user: userId,
      ...fileUpdates,
    };
    Object.keys(updateData).forEach((key) => {
      if (key.startsWith("savedTabs[") || key.startsWith("projects[")) delete updateData[key];
    });

    const draft = await GISMember.findOneAndUpdate(
      { user: userId, isDraft: true },
      { $set: updateData },
      {
        new: true,
        upsert: true,
        session,
        setDefaultsOnInsert: true,
        runValidators: false, // Drafts may not need full validation
      }
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Draft saved successfully",
      data: {
        draftId: draft._id,
        savedTabs: draft.savedTabs,
        lastSaved: draft.updatedAt,
      },
    });
  } catch (error) {
    await session.abortTransaction();

    if (req.files) {
      await Promise.all(
        Object.values(req.files)
          .flat()
          .map((file) => fs.unlink(file.path).catch((err) => console.error("File cleanup error:", err)))
      );
    }

    res.status(error.message.includes("Unauthorized") ? 401 : 500).json({
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === "development" && { error: error.stack }),
    });
  } finally {
    session.endSession();
  }
};

// Get GIS member data
export const getGISMemberData = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const projection = {
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
      "projects._id": 0,
      "workSamples._id": 0,
    };

    const data = await GISMember.findOne({ user: userId })
      .select(projection)
      .lean();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No registration data found",
      });
    }

    const { user, ...responseData } = data;

    res.status(200).json({
      success: true,
      data: responseData,
      isDraft: data.isDraft,
    });
  } catch (error) {
    console.error("Error fetching GIS data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch GIS data",
      ...(process.env.NODE_ENV === "development" && { error: error.stack }),
    });
  }
};

// Delete draft
export const deleteDraft = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Please log in first",
      });
    }

    const draft = await GISMember.findOneAndDelete({
      user: userId,
      isDraft: true,
    });

    if (!draft) {
      return res.status(404).json({
        success: false,
        message: "No draft found to delete",
      });
    }

    res.status(200).json({
      success: true,
      message: "Draft deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting draft:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete draft",
      ...(process.env.NODE_ENV === "development" && { error: error.stack }),
    });
  }
};
