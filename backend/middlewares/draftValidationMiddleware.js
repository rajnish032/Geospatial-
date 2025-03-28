import { body, checkSchema } from "express-validator";
import { validateRequest } from "./validationMiddleware.js"; // Your existing validation middleware

const draftGISRegistrationSchema = {
  
  'fullName': {
    optional: true,
    trim: true,
    isLength: {
      options: { max: 100 },
      errorMessage: 'Full name must be less than 100 characters'
    }
  },
  'dob': {
    optional: true,
    isISO8601: {
      errorMessage: 'Invalid date format (MM-DD-YYYY)'
    },
    custom: {
      options: (value) => {
        if (!value) return true;
        const birthDate = new Date(value);
        const minDate = new Date('1900-01-01');
        const maxDate = new Date();
        
        if (birthDate < minDate) throw new Error('Date of birth cannot be before 1900');
        if (birthDate > maxDate) throw new Error('Date of birth cannot be in the future');
        return true;
      }
    }
  },
  'gender': {
    optional: true,
    isIn: {
      options: [["Male", "Female", "Other", "Prefer not to say"]],
      errorMessage: "Invalid gender selection"
    }
  },
  'contactNumber': {
    optional: true,
    matches: {
      options: /^\d{10}$/,
      errorMessage: "Contact number must be 10 digits"
    }
  },
  'email': {
    optional: true,
    isEmail: {
      errorMessage: "Invalid email format"
    },
    normalizeEmail: true
  },
  'address': {
    optional: true,
    isLength: {
      options: { max: 200 },
      errorMessage: 'Address must be less than 200 characters'
    }
  },
  'pinCode': {
    optional: true,
    matches: {
      options: /^\d{6}$/,
      errorMessage: "Pin code must be 6 digits"
    }
  },

  // Education (optional)
  'institution': {
    optional: true,
    isLength: {
      options: { max: 100 },
      errorMessage: 'Institution name must be less than 100 characters'
    }
  },
  'education': {
    optional: true,
    isLength: {
      options: { max: 50 },
      errorMessage: 'Education must be less than 50 characters'
    }
  },
  'fieldOfStudy': {
    optional: true,
    isLength: {
      options: { max: 50 },
      errorMessage: 'Field of study must be less than 50 characters'
    }
  },

  // Projects (optional but validated if present)
  'projects': {
    optional: true,
    isArray: {
      errorMessage: 'Projects must be an array'
    }
  },
  'projects.*.title': {
    optional: true,
    isLength: {
      options: { max: 100 },
      errorMessage: 'Project title must be less than 100 characters'
    }
  },
  'projects.*.description': {
    optional: true,
    isLength: {
      options: { max: 500 },
      errorMessage: 'Project description must be less than 500 characters'
    }
  },

  // Terms (optional for draft)
  'acceptTerms': {
    optional: true,
    isBoolean: true,
    errorMessage: 'Accept terms must be a boolean'
  },

  // Tab tracking
  'activeTab': {
    optional: true,
    isInt: {
      options: { min: 1, max: 8 },
      errorMessage: 'Invalid tab number'
    }
  }
};

// Custom validation to ensure at least some data is being saved
const validateNonEmptyDraft = (req, res, next) => {
  const hasBodyData = Object.keys(req.body).some(
    key => key !== 'activeTab' && req.body[key] !== undefined && req.body[key] !== ''
  );
  
  const hasFiles = req.files && (
    req.files.profileImage?.length > 0 ||
    req.files.workSamples?.length > 0 ||
    req.files.certificationFile?.length > 0
  );

  if (!hasBodyData && !hasFiles) {
    return res.status(400).json({
      success: false,
      message: "Cannot save empty draft",
      errorCode: "EMPTY_DRAFT_ERROR"
    });
  }
  next();
};

// Combine all draft validations
export const validateDraftGISRegistration = [
  checkSchema(draftGISRegistrationSchema),
  validateNonEmptyDraft,
  validateRequest // Your existing validation error handler
];

// File validation for drafts (more lenient than final submission)
export const validateDraftFileUploads = (req, res, next) => {
  if (!req.files) return next();

  const errors = [];
  const { profileImage, workSamples, certificationFile } = req.files;

  // Validate profile image if present
  if (profileImage?.[0]) {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(profileImage[0].mimetype)) {
      errors.push({
        field: 'profileImage',
        message: 'Only JPEG/PNG images allowed'
      });
    }
    if (profileImage[0].size > 3 * 1024 * 1024) { // 3MB for drafts
      errors.push({
        field: 'profileImage',
        message: 'Image must be <3MB'
      });
    }
  }

  // Validate work samples if present
  if (workSamples?.length > 0) {
    if (workSamples.length > 5) {
      errors.push({
        field: 'workSamples',
        message: 'Max 5 work samples allowed'
      });
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg', 
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    workSamples.forEach((file, i) => {
      if (!allowedTypes.includes(file.mimetype)) {
        errors.push({
          field: `workSamples[${i}]`,
          message: 'Invalid file type'
        });
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB for drafts
        errors.push({
          field: `workSamples[${i}]`,
          message: 'File must be <10MB'
        });
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "File validation failed",
      errors,
      errorCode: "DRAFT_FILE_VALIDATION_ERROR"
    });
  }

  next();
};