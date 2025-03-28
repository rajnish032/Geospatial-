import { body, validationResult, checkSchema } from "express-validator";
import createError from 'http-errors';

// Enhanced validation error formatter
const formatValidationError = (errors) => {
  return errors.array().map(err => ({
    field: err.path,
    message: err.msg,
    value: err.value
  }));
};

// Middleware to handle validation errors
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = formatValidationError(errors);
    return res.status(400).json({ 
      success: false,
      message: "Validation failed",
      errors: formattedErrors,
      errorCode: "VALIDATION_ERROR"
    });
  }
  next();
};

// Schema-based validation for better organization
const gisRegistrationSchema = {
  // Personal Info Validation
  'fullName': {
    notEmpty: true,
    errorMessage: 'Full name is required',
    trim: true,
    isLength: {
      options: { max: 100 },
      errorMessage: 'Full name must be less than 100 characters'
    }
  },
  'dob': {
    notEmpty: true,
    errorMessage: 'Date of birth is required',
    isISO8601: {
      errorMessage: 'Invalid date format (YYYY-MM-DD)'
    },
    custom: {
      options: (value) => {
        const birthDate = new Date(value);
        const minDate = new Date('1900-01-01');
        const maxDate = new Date();
        
        if (birthDate < minDate) {
          throw new Error('Date of birth cannot be before 1900');
        }
        if (birthDate > maxDate) {
          throw new Error('Date of birth cannot be in the future');
        }
        return true;
      }
    }
  },
  'gender': {
    isIn: {
      options: [["Male", "Female", "Other", "Prefer not to say"]],
      errorMessage: "Invalid gender selection"
    }
  },
  'contactNumber': {
    matches: {
      options: /^\d{10}$/,
      errorMessage: "Contact number must be 10 digits"
    }
  },
  'email': {
    isEmail: true,
    errorMessage: "Invalid email format",
    normalizeEmail: true,
    custom: {
      options: async (value, { req }) => {
        // Add additional email validation if needed
        const emailDomain = value.split('@')[1];
        if (emailDomain.includes('example.com')) {
          throw new Error('Temporary email domains are not allowed');
        }
        return true;
      }
    }
  },
  // ... (continue with other fields in similar schema format)
};

// GIS Registration Validation Rules
export const validateGISRegistration = checkSchema(gisRegistrationSchema);

// Additional validation middleware for file uploads
export const validateFileUploads = (req, res, next) => {
  if (!req.files) {
    return next();
  }

  const errors = [];
  const { profileImage, workSamples, certificationFile } = req.files;

  // Validate profile image
  if (profileImage) {
    const allowedImageTypes = ['image/jpeg', 'image/png'];
    if (!allowedImageTypes.includes(profileImage[0].mimetype)) {
      errors.push({
        field: 'profileImage',
        message: 'Profile image must be JPEG or PNG'
      });
    }
    if (profileImage[0].size > 2 * 1024 * 1024) { // 2MB
      errors.push({
        field: 'profileImage',
        message: 'Profile image must be less than 2MB'
      });
    }
  }

  // Validate work samples
  if (workSamples && workSamples.length > 5) {
    errors.push({
      field: 'workSamples',
      message: 'Maximum 5 work samples allowed'
    });
  }

  if (workSamples) {
    const allowedFileTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    workSamples.forEach((file, index) => {
      if (!allowedFileTypes.includes(file.mimetype)) {
        errors.push({
          field: `workSamples[${index}]`,
          message: 'Invalid file type for work sample'
        });
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        errors.push({
          field: `workSamples[${index}]`,
          message: 'Work sample must be less than 5MB'
        });
      }
    });
  }

  // Validate certification file
  if (certificationFile) {
    const allowedCertTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedCertTypes.includes(certificationFile[0].mimetype)) {
      errors.push({
        field: 'certificationFile',
        message: 'Certification must be PDF, JPEG, or PNG'
      });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "File validation failed",
      errors,
      errorCode: "FILE_VALIDATION_ERROR"
    });
  }

  next();
};

// Custom validation for complex fields
export const validateProjects = [
  body('projects').isArray({ min: 1 }).withMessage('At least one project is required'),
  body('projects.*.title').notEmpty().trim().withMessage('Project title is required'),
  body('projects.*.description').notEmpty().trim()
    .withMessage('Project description is required')
    .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('projects.*.technologies').optional().trim()
];

// Conditional validation middleware
export const validateEquipment = [
  body('ownEquipment').if(body('ownEquipment').exists())
    .isIn(['Yes', 'No']).withMessage('Invalid equipment ownership selection'),
  body('availableEquipment').if(body('ownEquipment').equals('Yes'))
    .isArray({ min: 1 }).withMessage('At least one equipment item is required when owning equipment'),
  body('equipmentName').if(body('ownEquipment').equals('Yes'))
    .notEmpty().withMessage('Equipment name is required when owning equipment')
];