import GISMember from "../models/GISMemberRegistration.js";
import fs from "fs";
import UserModel from "../models/User.js";
import { validationResult, check } from "express-validator";
import mongoose from "mongoose";

export const validateGISRegistration = [
  check("fullName").notEmpty().withMessage("Full Name is required"),
  check("dob").notEmpty().withMessage("Date of Birth is required"),
  check("gender")
    .isIn(["Male", "Female", "Other", "Prefer not to say"])
    .withMessage("Invalid gender"),
  check("contactNumber")
    .matches(/^\d{10}$/)
    .withMessage("Invalid contact number"),
  check("email").isEmail().withMessage("Invalid email format"),
  check("address").notEmpty().withMessage("Address is required"),
  check("pinCode")
    .matches(/^\d{6}$/)
    .withMessage("Invalid pin code"),
  check("city").notEmpty().withMessage("City is required"),
  check("state").notEmpty().withMessage("State is required"),
  check("institution").notEmpty().withMessage("Institution is required"),
  check("fieldOfStudy").notEmpty().withMessage("Field of Study is required"),
  check("projects")
    .isArray({ min: 3 })
    .withMessage("At least 3 projects required"),
  check("projects.*.title").notEmpty().withMessage("Project title is required"),
  check("projects.*.description")
    .notEmpty()
    .withMessage("Project description is required"),
  check("acceptTerms").equals("true").withMessage("You must accept the terms"), // Adjust if sent as boolean
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

export const registerGISMember = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    if (!req.user?._id) {
      throw new Error("Unauthorized: Please log in first");
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array()
      });
    }

    // Parse availableEquipment from FormData
    const availableEquipment = [];
    for (let key in req.body) {
      if (key.startsWith('availableEquipment[')) {
        const index = parseInt(key.match(/\[(\d+)\]/)[1]);
        const value = req.body[key].trim();
        if (value) {
          availableEquipment[index] = value;
        }
      }
    }

    const filePaths = {
      profileImage: req.files?.profileImage?.[0]?.path,
      workSamples: req.files?.workSamples?.map(f => f.path),
      certificationFile: req.files?.certificationFile?.[0]?.path
    };

    // Check for existing non-draft registration
    const existing = await GISMember.findOne({ 
      user: req.user._id,
      isDraft: false 
    }).session(session);

    if (existing) {
      throw new Error("GIS Registration already completed");
    }

    // Clean req.body of FormData keys and _id
    const memberData = { ...req.body };
    Object.keys(memberData).forEach(key => {
      if (key.startsWith('availableEquipment[') || key === '_id') {
        delete memberData[key];
      }
    });

    // Add parsed availableEquipment and other fields
    memberData.availableEquipment = availableEquipment.filter(Boolean);
    Object.assign(memberData, filePaths, {
      isDraft: false,
      submittedAt: new Date(),
      user: req.user._id
    });

    // Debugging: Log memberData
    console.log('memberData:', memberData);

    // If a draft exists, update it; otherwise, create new
    let newMember;
    const draft = await GISMember.findOne({ user: req.user._id, isDraft: true }).session(session);
    if (draft) {
      newMember = await GISMember.findOneAndUpdate(
        { user: req.user._id, isDraft: true },
        { $set: memberData },
        { new: true, session }
      );
    } else {
      [newMember] = await GISMember.create([memberData], { session });
    }

    await UserModel.findByIdAndUpdate(
      req.user._id,
      { isGISRegistered: true },
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        memberId: newMember._id,
        redirectTo: "/user/profile"
      }
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Registration error:", error);

    if (req.files) {
      Object.values(req.files).flat().forEach(file => {
        fs.unlink(file.path, err => err && console.error("File cleanup error:", err));
      });
    }

    const status = error.message.includes("Unauthorized") ? 401 : 
                  error.message.includes("Validation") ? 400 : 
                  error.message.includes("already") ? 409 : 500;
    
    res.status(status).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    session.endSession();
  }
};

export const updateGISMemberData = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Please log in first" });
    }

    // Parse savedTabs from FormData
    const savedTabs = [];
    for (let key in req.body) {
      if (key.startsWith("savedTabs[")) {
        const index = parseInt(key.match(/\[(\d+)\]/)[1]);
        savedTabs[index] = parseInt(req.body[key]);
      }
    }

    const updates = { ...req.body };
    Object.keys(updates).forEach((key) => {
      if (key.startsWith("savedTabs[")) delete updates[key];
    });
    if (savedTabs.length > 0) updates.savedTabs = savedTabs;

    if (req.files?.profileImage?.[0]?.path) {
      updates.profileImage = req.files.profileImage[0].path;
    }
    if (req.files?.workSamples) {
      updates.workSamples = req.files.workSamples.map((file) => file.path);
    }
    if (req.files?.certificationFile?.[0]?.path) {
      updates.certificationFile = req.files.certificationFile[0].path;
    }

    const memberData = await GISMember.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates },
      {
        new: true,
        runValidators: true,
        select: "-__v -createdAt -updatedAt",
      }
    );

    if (!memberData) {
      return res.status(404).json({ message: "GIS Registration not found" });
    }

    res.status(200).json({
      message: "GIS Data updated successfully!",
      memberData,
    });
  } catch (error) {
    console.error("Error updating GIS data:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const checkForDraft = async (req, res) => {
  try {
    const draft = await GISMember.findOne({
      user: req.user._id,
      isDraft: true,
    }).select("-__v -createdAt -updatedAt");

    res.status(200).json({
      exists: !!draft,
      draftData: draft,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error checking for draft",
      error: error.message,
    });
  }
};

export const saveDraft = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    if (!req.user?._id) {
      throw new Error("Unauthorized");
    }

    // Parse savedTabs from FormData
    const savedTabs = [];
    for (let key in req.body) {
      if (key.startsWith("savedTabs[")) {
        const index = parseInt(key.match(/\[(\d+)\]/)[1]);
        savedTabs[index] = parseInt(req.body[key]); // Convert to number
      }
    }

    // Add activeTab to savedTabs if not already present
    const activeTab = parseInt(req.body.activeTab) || 1;
    if (!savedTabs.includes(activeTab)) {
      savedTabs.push(activeTab);
    }

    // Parse projects from FormData
    const projects = [];
    const projectKeys = Object.keys(req.body).filter((k) =>
      k.startsWith("projects[")
    );
    projectKeys.forEach((key) => {
      const match = key.match(/projects\[(\d+)\]\[(\w+)\]/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];
        if (!projects[index]) projects[index] = {};
        projects[index][field] = req.body[key];
      }
    });

    // Prepare file updates
    const fileUpdates = {};
    if (req.files?.profileImage) {
      fileUpdates.profileImage = req.files.profileImage[0].path;
      const old = await GISMember.findOne({ user: req.user._id }).select(
        "profileImage"
      );
      if (old?.profileImage) {
        fs.unlink(old.profileImage, () => {});
      }
    }
    if (req.files?.workSamples) {
      fileUpdates.workSamples = req.files.workSamples.map((file) => file.path);
    }
    if (req.files?.certificationFile) {
      fileUpdates.certificationFile = req.files.certificationFile[0].path;
    }

    // Clean up req.body and prepare update data
    const updateData = { ...req.body };
    Object.keys(updateData).forEach((key) => {
      if (key.startsWith("savedTabs[") || key.startsWith("projects[")) {
        delete updateData[key];
      }
    });

    // Add parsed data
    updateData.savedTabs = savedTabs;
    updateData.projects = projects.filter((p) => p && p.title); // Filter incomplete projects
    updateData.lastSavedTab = activeTab;
    updateData.isDraft = req.body.isDraft === "true";
    Object.assign(updateData, fileUpdates);

    // Update the draft
    const draft = await GISMember.findOneAndUpdate(
      { user: req.user._id, isDraft: true },
      { $set: updateData },
      {
        new: true,
        upsert: true,
        session,
        setDefaultsOnInsert: true,
        runValidators: false, // Adjust based on your validation needs
      }
    );

    await session.commitTransaction();

    res.json({
      success: true,
      data: {
        draftId: draft._id,
        savedTabs: draft.savedTabs,
        lastSaved: draft.updatedAt,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Draft save error:", error);

    // Clean up uploaded files on error
    if (req.files) {
      Object.values(req.files)
        .flat()
        .forEach((file) => {
          fs.unlink(
            file.path,
            (err) => err && console.error("File cleanup error:", err)
          );
        });
    }

    res.status(error.message === "Unauthorized" ? 401 : 500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

export const getGISMemberData = async (req, res) => {
  try {
    const { _id: userId } = req.user || {};
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
      .lean()
      .cache(60 * 5);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No registration data found",
      });
    }

    const { user, isDraft, ...responseData } = data;

    res.json({
      success: true,
      data: responseData,
      isDraft: data.isDraft,
    });
  } catch (error) {
    console.error("Data fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data",
    });
  }
};

export const deleteDraft = async (req, res) => {
  try {
    await GISMember.findOneAndDelete({
      user: req.user._id,
      isDraft: true,
    });
    res.status(200).json({ message: "Draft deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting draft",
      error: error.message,
    });
  }
};
