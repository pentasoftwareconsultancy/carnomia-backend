import mongoose from "mongoose";
const SeatSchema = new mongoose.Schema({
  name: String,
  issue: String,
  imageUrls: [String],
});

export default SeatSchema;
