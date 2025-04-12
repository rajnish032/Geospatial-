import express from "express";
import multer from "multer";
import path from "path";
import {
  registerGISMember,
  getGISMemberData,
  updateGISMemberData,
  checkForDraft,
  saveDraft,
  deleteDraft,
} from "../controllers/gisRegistrationController.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  validateGISRegistration,
  validateFileUploads,
  validateRequest,
} from "../middlewares/validationMiddleware.js";
import {
  validateDraftGISRegistration,
  validateDraftFileUploads,
} from "../middlewares/draftValidationMiddleware.js";

const router = express.Router();

// Ensure uploads directory exists
import fs from "fs";
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created uploads directory:", uploadDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = file.originalname.split(".").pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  },
});

// File filter for allowed types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPEG, PNG, PDF, and Word documents are allowed."),
      false
    );
  }
};

// Multer instances
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 6 }, // Adjusted to match frontend (5 workSamples + 1 profileImage/certificationFile)
  fileFilter,
});

const draftUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 6 }, // Adjusted to match frontend
  fileFilter,
});

// Multer error handler middleware
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer Error:", err.message);
    console.error("Unexpected Field:", err.field);
    console.error("Stack Trace:", err.stack);
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds the limit (5MB for submit/update, 10MB for draft).",
        errorCode: "FILE_SIZE_LIMIT",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: `Unexpected field: ${err.field}. Expected fields are: profileImage, workSamples, certificationFile.`,
        errorCode: "UNEXPECTED_FIELD",
        unexpectedField: err.field,
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files uploaded. Maximum is 5 work samples plus 1 profile image and 1 certification file.",
        errorCode: "FILE_COUNT_LIMIT",
      });
    }
    return res.status(400).json({
      success: false,
      message: `Multer error: ${err.message}`,
      errorCode: "MULTER_ERROR",
    });
  } else if (err) {
    console.error("Other Error in Multer Middleware:", err.message);
    console.error("Stack Trace:", err.stack);
    return res.status(400).json({
      success: false,
      message: err.message,
      errorCode: "FILE_VALIDATION_ERROR",
    });
  }
  next();
};

// Routes
router
  .route("/draft")
  .get(protect, checkForDraft)
  .put(
    protect,
    draftUpload.fields([
      { name: "profileImage", maxCount: 1 },
      { name: "workSamples", maxCount: 5 }, // Aligned with frontend limit
      { name: "certificationFile", maxCount: 1 },
    ]),
    multerErrorHandler,
    validateDraftFileUploads, // Ensure this exists or remove
    validateDraftGISRegistration, // Ensure this exists or remove
    validateRequest,
    saveDraft
  )
  .delete(protect, deleteDraft);

router.post(
  "/submit",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "workSamples", maxCount: 5 }, // Aligned with frontend limit
    { name: "certificationFile", maxCount: 1 },
  ]),
  multerErrorHandler,
  validateGISRegistration,
  validateFileUploads,
  validateRequest,
  registerGISMember
);

// Optional: Keep only if needed for updating finalized registrations
router
  .route("/me")
  .get(protect, getGISMemberData)
  .put(
    protect,
    upload.fields([
      { name: "profileImage", maxCount: 1 },
      { name: "workSamples", maxCount: 5 }, // Aligned with frontend limit
      { name: "certificationFile", maxCount: 1 },
    ]),
    multerErrorHandler,
    updateGISMemberData // Add validation if keeping this route
  );

// Serve uploaded files statically (optional)
router.use("/uploads", express.static(uploadDir));

export default router;