import { body, validationResult } from "express-validator";

// Middleware to handle validation errors
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Validation failed", errors: errors.array() });
  }
  next();
};

// GIS Registration Validation Rules
export const validateGISRegistration = [
  body("fullName").notEmpty().withMessage("Full name is required"),
  body("dob").notEmpty().withMessage("Date of birth is required"),
  body("gender").notEmpty().withMessage("Gender is required"),
  body("contactNumber").isMobilePhone().withMessage("Invalid contact number"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("address").notEmpty().withMessage("Address is required"),
  body("education").notEmpty().withMessage("Education is required"),
  body("institution").notEmpty().withMessage("Institution is required"),
  body("fieldOfStudy").notEmpty().withMessage("Field of study is required"),
  body("experience").optional().isNumeric().withMessage("Experience must be a number"),
  body("employer").optional().isString().withMessage("Employer must be a string"),
  body("jobTitle").optional().isString().withMessage("Job title must be a string"),
  body("skills").optional().isArray().withMessage("Skills must be an array"),
  body("workMode").optional().isString().withMessage("Work mode must be a string"),
  body("workType").optional().isString().withMessage("Work type must be a string"),
  body("workHours").optional().isNumeric().withMessage("Work hours must be a number"),
  body("linkedIn").optional().isURL().withMessage("LinkedIn must be a valid URL"),
  body("portfolio").optional().isURL().withMessage("Portfolio must be a valid URL"),
  body("certifications").optional().isArray().withMessage("Certifications must be an array"),
  body("additionalInfo").optional().isString().withMessage("Additional info must be a string"),
];

