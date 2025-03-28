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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images, PDFs, and documents are allowed."
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10, // Maximum 10 files
  },
  fileFilter: fileFilter,
});

const draftUpload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for drafts
    files: 10,
  },
  fileFilter: fileFilter,
});

const router = express.Router();

router.get("/draft", protect, checkForDraft);

router.put(
  "/draft",
  protect,
  draftUpload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "workSamples", maxCount: 10 },
    { name: "certificationFile", maxCount: 1 },
  ]),
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
  updateGISMemberData
);

export default router;
