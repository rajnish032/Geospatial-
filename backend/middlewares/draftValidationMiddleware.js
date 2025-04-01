import { body, checkSchema } from "express-validator";
import { validateRequest } from "./validationMiddleware.js"; // Assumed existing middleware

const draftGISRegistrationSchema = {
  fullName: {
    optional: true,
    trim: true,
    isLength: {
      options: { max: 100 },
      errorMessage: "Full name must be less than 100 characters",
    },
  },
  dob: {
    optional: true,
    isISO8601: {
      errorMessage: "Invalid date format (expected ISO 8601, e.g., YYYY-MM-DD)",
    },
    custom: {
      options: (value) => {
        if (!value) return true;
        const birthDate = new Date(value);
        const minDate = new Date("1900-01-01");
        const maxDate = new Date();
        if (birthDate < minDate) throw new Error("Date of birth cannot be before 1900");
        if (birthDate > maxDate) throw new Error("Date of birth cannot be in the future");
        return true;
      },
    },
  },
  gender: {
    optional: true,
    isIn: {
      options: [["Male", "Female", "Other", "Prefer not to say"]],
      errorMessage: "Invalid gender selection",
    },
  },
  contactNumber: {
    optional: true,
    matches: {
      options: /^\d{10}$/,
      errorMessage: "Contact number must be exactly 10 digits",
    },
  },
  email: {
    optional: true,
    isEmail: {
      errorMessage: "Invalid email format",
    },
    normalizeEmail: true,
  },
  address: {
    optional: true,
    isLength: {
      options: { max: 200 },
      errorMessage: "Address must be less than 200 characters",
    },
  },
  pinCode: {
    optional: true,
    matches: {
      options: /^\d{6}$/,
      errorMessage: "Pin code must be exactly 6 digits",
    },
  },
  institution: {
    optional: true,
    isLength: {
      options: { max: 100 },
      errorMessage: "Institution name must be less than 100 characters",
    },
  },
  education: {
    optional: true,
    isLength: {
      options: { max: 50 },
      errorMessage: "Education must be less than 50 characters",
    },
  },
  fieldOfStudy: {
    optional: true,
    isLength: {
      options: { max: 50 },
      errorMessage: "Field of study must be less than 50 characters",
    },
  },
  projects: {
    optional: true,
    isArray: {
      errorMessage: "Projects must be an array",
    },
  },
  "projects.*.title": {
    optional: true,
    isLength: {
      options: { max: 100 },
      errorMessage: "Project title must be less than 100 characters",
    },
  },
  "projects.*.description": {
    optional: true,
    isLength: {
      options: { max: 500 },
      errorMessage: "Project description must be less than 500 characters",
    },
  },
  acceptTerms: {
    optional: true,
    custom: {
      options: (value) => value === true || value === "true",
      errorMessage: "Accept terms must be a boolean or 'true'",
    },
  },
  activeTab: {
    optional: true,
    isInt: {
      options: { min: 1, max: 8 },
      errorMessage: "Active tab must be an integer between 1 and 8",
    },
  },
  "savedTabs.*": {
    optional: true,
    isInt: {
      options: { min: 1, max: 8 },
      errorMessage: "Saved tab must be an integer between 1 and 8",
    },
  },
};

// Ensure draft isn’t completely empty
const validateNonEmptyDraft = (req, res, next) => {
  const hasBodyData = Object.keys(req.body).some(
    (key) =>
      key !== "activeTab" &&
      req.body[key] !== undefined &&
      req.body[key] !== "" &&
      req.body[key] !== null
  );
  const hasFiles =
    req.files &&
    (req.files.profileImage?.length > 0 ||
      req.files.workSamples?.length > 0 ||
      req.files.certificationFile?.length > 0);

  if (!hasBodyData && !hasFiles) {
    return res.status(400).json({
      success: false,
      message: "Cannot save an empty draft",
      errorCode: "EMPTY_DRAFT_ERROR",
    });
  }
  next();
};

// Combine draft validations
export const validateDraftGISRegistration = [
  checkSchema(draftGISRegistrationSchema),
  validateNonEmptyDraft,
  validateRequest, // Assumes this collects errors and sends JSON response
];

// Validate file uploads for drafts
export const validateDraftFileUploads = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) return next();

  const errors = [];
  const { profileImage, workSamples, certificationFile } = req.files;

  // Profile image validation
  if (profileImage?.[0]) {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(profileImage[0].mimetype)) {
      errors.push({
        field: "profileImage",
        message: "Profile image must be JPEG or PNG",
      });
    }
    if (profileImage[0].size > 3 * 1024 * 1024) {
      errors.push({
        field: "profileImage",
        message: "Profile image must be less than 3MB",
      });
    }
  }

  // Work samples validation
  if (workSamples?.length > 0) {
    if (workSamples.length > 5) {
      errors.push({
        field: "workSamples",
        message: "Maximum 5 work samples allowed",
      });
    }
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    workSamples.forEach((file, i) => {
      if (!allowedTypes.includes(file.mimetype)) {
        errors.push({
          field: `workSamples[${i}]`,
          message: "Work sample must be PDF, JPEG, PNG, or Word document",
        });
      }
      if (file.size > 10 * 1024 * 1024) {
        errors.push({
          field: `workSamples[${i}]`,
          message: "Work sample must be less than 10MB",
        });
      }
    });
  }

  // Certification file validation
  if (certificationFile?.[0]) {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(certificationFile[0].mimetype)) {
      errors.push({
        field: "certificationFile",
        message: "Certification file must be PDF or Word document",
      });
    }
    if (certificationFile[0].size > 10 * 1024 * 1024) {
      errors.push({
        field: "certificationFile",
        message: "Certification file must be less than 10MB",
      });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Draft file validation failed",
      errors,
      errorCode: "DRAFT_FILE_VALIDATION_ERROR",
    });
  }

  next();
};