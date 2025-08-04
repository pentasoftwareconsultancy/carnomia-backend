// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      default: null,
    },
    email: {
      type: String,

      default: null,
    },

    mobile: {
      type: String,

      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    designation: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ["engineer", "admin", "superadmin", "customer"],
      default: "customer",
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
