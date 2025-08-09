import mongoose from "mongoose";
const RubberPanelSchema = new mongoose.Schema({
  name: String,
  issue: String,
  imageUrls: [String],
});

export default RubberPanelSchema;
