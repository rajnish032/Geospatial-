import mongoose from "mongoose";

const GISMemberSchema = new mongoose.Schema(
  {
    isDraft: { 
      type: Boolean, 
      default: true 
    },
    lastSavedTab: { 
      type: Number, 
      default: 1 
    },
    savedTabs: [{ 
      type: Number 
    }],
    submittedAt: { 
      type: Date 
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      unique: true 
    },

    // Personal Info
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { 
      type: String, 
      required: true, 
      enum: ["Male", "Female", "Other", "Prefer not to say"] 
    },
    contactNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Invalid contact number (must be 10 digits)"],
    },
    email: { 
      type: String, 
      required: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"]
    },
    nationality: { type: String, required: true },
    profileImage: { type: String }, // Stores file path or URL
    address: { type: String, required: true },
    pinCode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, "Invalid pin code (must be 6 digits)"]
    },
    city: { type: String, required: true },
    state: { type: String, required: true },

    // Education
    institution: { type: String, required: true },
    education: { type: String, required: true },
    certifications: [{ type: String }],
    fieldOfStudy: { type: String, required: true },
    year: { type: String },

    // Technical Skills
    gisSoftware: [{ type: String }],
    gisSoftwareOther: { type: String },
    programmingSkills: [{ type: String }],
    programmingSkillsOther: { type: String },
    CoreExpertise: [{ type: String }],
    CoreExpertiseOther: { type: String },
    droneDataProcessing: { 
      type: String,
      enum: ["None", "Beginner", "Intermediate", "Advanced"]
    },
    photogrammetrySoftware: [{ type: String }],
    photogrammetrySoftwareOther: { type: String },
    remoteSensing: { 
      type: String,
      enum: ["None", "Beginner", "Intermediate", "Advanced"]
    },
    lidarProcessing: { 
      type: String,
      enum: ["None", "Beginner", "Intermediate", "Advanced"]
    },

    // Professional Info
    experience: { type: String, required: true },
    organization: { type: String },
    employer: { 
      type: String,
      enum: ["Full-time", "Part-time", "Freelancer", "Student", "Unemployed", "Other"]
    },
    linkedIn: {
      type: String,
      match: [/^https?:\/\/(www\.)?linkedin\.com\/.*$/, "Invalid LinkedIn URL"],
    },
    portfolio: {
      type: String,
      match: [/^https?:\/\/.*$/, "Invalid Portfolio URL"],
    },
    jobTitle: { type: String },
    skills: [{ type: String }],

    // Work Preferences
    workMode: { 
      type: String, 
      enum: ["Remote", "On-site", "Hybrid"],
      default: "Remote"
    },
    workType: { 
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Freelance"],
      default: "Full-time"
    },
    workHours: { type: String },
    availability: { 
      type: String,
      enum: [
        "Full-time",
        "Immediately Available",
        "Available in 1-2 weeks",
        "Available in 1 month",
        "Not currently available"
      ],
      default: "Full-time"
    },
    travelWillingness: { 
      type: String,
      enum: ["Yes", "No", "Limited"],
      default: "Yes"
    },
    preferredTimeZones: { type: String },
    serviceModes: [{ 
      type: String,
      enum: ["Online", "On-site", "Hybrid", "Consultation"]
    }],

    // Projects
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        technologies: { type: String, required: true }
      }
    ],

    // Equipment
    ownEquipment: { 
      type: String,
      enum: ["Yes", "No"]
    },
    availableEquipment: [{ 
      type: String,
      enum: [
        "GPS Receiver",
        "Total Station",
        "Drone/UAV",
        "3D Scanner",
        "Survey Grade Tablet",
        "Laser Distance Meter",
        "Other"
      ]
    }],
    equipmentName: { type: String },
    equipmentBrand: { type: String },
    equipmentYear: { type: String },
    equipmentSpecs: { type: String },
    maintenanceSchedule: { type: String },
    droneCertification: { 
      type: String,
      enum: ["Yes", "No"]
    },
    certificationFile: { type: String }, // Stores file path or URL
    equipmentRental: { 
      type: String,
      enum: ["Yes", "No"]
    },
    rentalTerms: { type: String },

    // Work Samples
    workSamples: [{ type: String }], // Array of file paths or URLs
    videoShowcase: { type: String },

    // Terms
    acceptTerms: { 
      type: Boolean,
      required: true,
      default: false,
      validate: {
        validator: (value) => value === true,
        message: "You must accept the terms and conditions"
      }
    },
    consentMarketing: { type: Boolean, default: false }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
GISMemberSchema.index({ user: 1 });
GISMemberSchema.index({ email: 1 });
GISMemberSchema.index({ skills: 1 });
GISMemberSchema.index({ gisSoftware: 1 });
GISMemberSchema.index({ CoreExpertise: 1 });

const GISMember = mongoose.model("GISMember", GISMemberSchema);
export default GISMember;

