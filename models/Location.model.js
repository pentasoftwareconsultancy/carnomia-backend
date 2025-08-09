import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    locations: {
      type: [String], 
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Location", locationSchema);
