import express from "express";
import multer from "multer";
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
  validateRequest,
} from "../middlewares/validationMiddleware.js";
import {
  validateDraftGISRegistration,
  validateDraftFileUploads,
} from "../middlewares/draftValidationMiddleware.js";

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}.${file.originalname.split(".").pop()}`
    );
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
      new Error(
        "Invalid file type. Only JPEG, PNG, PDF, and Word documents are allowed."
      ),
      false
    );
  }
};

// Multer instances
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 }, // 5MB, 10 files max
  fileFilter,
});

const draftUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 }, // 10MB, 10 files max
  fileFilter,
});

// Multer error handler middleware
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Multer error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Routes
router.get("/draft", protect, checkForDraft);

router.put(
  "/draft",
  protect,
  draftUpload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "workSamples", maxCount: 10 },
    { name: "certificationFile", maxCount: 1 },
  ]),
  multerErrorHandler,
  validateDraftFileUploads,
  validateDraftGISRegistration,
  validateRequest,
  saveDraft
);

router.delete("/draft", protect, deleteDraft);

router.post(
  "/submit",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "workSamples", maxCount: 10 },
    { name: "certificationFile", maxCount: 1 },
  ]),
  multerErrorHandler,
  validateGISRegistration,
  validateRequest,
  registerGISMember
);

router.get("/me", protect, getGISMemberData);

router.put(
  "/me",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "workSamples", maxCount: 10 },
    { name: "certificationFile", maxCount: 1 },
  ]),
  multerErrorHandler,
  updateGISMemberData
);

export default router;
