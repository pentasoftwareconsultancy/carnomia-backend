import mongoose from "mongoose";
const TyreSchema = new mongoose.Schema({
  position: String,
  brand: String,
  subBrand: String,
  size: String,
  manufacturingDate: String, // MM/YY
  treadDepth: Number,
  issue: String,
  imageUrls: [String],
});

export default TyreSchema;
