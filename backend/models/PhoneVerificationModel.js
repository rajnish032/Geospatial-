import mongoose from "mongoose";

// Defining Schema
const phoneVerificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: String, required: true }, // OTPless orderId
  createdAt: { type: Date, default: Date.now, expires: '15m' } // Match OTPless expiry
});

// Model
const PhoneVerificationModel = mongoose.model("PhoneVerification", phoneVerificationSchema);

export default PhoneVerificationModel;