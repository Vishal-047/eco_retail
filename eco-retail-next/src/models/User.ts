import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpires: { type: Date },
  // Green Points fields
  points: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  activities: [{
    type: {
      type: String, // 'purchase' | 'upcycle' | 'packaging' | 'social' | 'admin'
      required: true
    },
    description: { type: String },
    points: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
    proofUrl: { type: String }
  }],
});

export default mongoose.models.User || mongoose.model("User", UserSchema); 