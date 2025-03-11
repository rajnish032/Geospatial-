import mongoose from "mongoose";

const GISMemberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },

    contactNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Invalid contact number"], // Ensure 10-digit phone number
    },

    email: { type: String, required: true, unique: true },

    address: { type: String, required: true },
    education: { type: String, required: true },
    institution: { type: String, required: true },
    fieldOfStudy: { type: String, required: true },
    experience: { type: String, required: true },
    employer: { type: String },
    jobTitle: { type: String },

    skills: {
      type: [String],
      required: true,
      validate: {
        validator: (array) => array.length > 0,
        message: "At least one skill is required",
      },
    },

    workMode: { type: String, required: true, enum: ["Remote", "Hybrid", "Onsite"] },
    workType: { type: String, required: true },
    workHours: { type: String, required: true },

    linkedIn: {
      type: String,
      match: [/^https?:\/\/(www\.)?linkedin\.com\/.*$/, "Invalid LinkedIn URL"],
    },

    portfolio: {
      type: String,
      match: [/^https?:\/\/.*$/, "Invalid Portfolio URL"],
    },

    certifications: [{ type: String }],
    additionalInfo: { type: String },
  },
  { timestamps: true }
);

const GISMember = mongoose.model("GISMember", GISMemberSchema);
export default GISMember;

