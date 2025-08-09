import mongoose from "mongoose";
const GlassPanelSchema = new mongoose.Schema({
  name: String,
  brand: String,
  manufacturingDate: String, // MM/YY
  issue: String,
  imageUrls: [String]
});

export default GlassPanelSchema;