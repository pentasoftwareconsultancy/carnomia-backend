import mongoose from "mongoose";
const FeatureSchema = new mongoose.Schema({
  name: String,
  isWorking: Boolean
});

export default FeatureSchema;