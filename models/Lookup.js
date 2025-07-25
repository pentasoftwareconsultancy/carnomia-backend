// models/Lookup.js
import mongoose from "mongoose";

const lookupSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    value: { type: String, required: true },
    label: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

lookupSchema.index({ type: 1, value: 1 }, { unique: true }); // To prevent duplicate type+value

export default mongoose.model("Lookup", lookupSchema);
