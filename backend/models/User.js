import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, unique: true, lowercase: true }, // Removed required
  password: { type: String, trim: true }, // Removed required
  phoneNumber: { type: String, required: true, trim: true },
  countryCode: { type: String, required: true, trim: true },
  areaPin: { type: String, trim: true }, // Added from your registration flow
  locality: { type: String, trim: true }, // Added from your registration flow
  city: { type: String, trim: true }, // Added from your registration flow
  state: { type: String, trim: true }, // Added from your registration flow
  is_verified: { type: Boolean, default: false }, // Email verification status
  is_phone_verified: { type: Boolean, default: false }, // Phone verification status
  isGISRegistered: { type: Boolean, default: false },
  roles: { type: [String], enum: ["user", "admin"], default: ["user"] },
  refreshToken: { type: String },
}, { timestamps: true });

// Ensure phoneNumber and countryCode combination is unique
userSchema.index({ phoneNumber: 1, countryCode: 1 }, { unique: true });

const UserModel = mongoose.model("User", userSchema);
export default UserModel;