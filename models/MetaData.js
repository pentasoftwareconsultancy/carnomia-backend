import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
  label: String,
  value: String,
});

const folderSchema = new mongoose.Schema({
  folderName: { type: String, required: true },
  fields: [fieldSchema],
});

const metaDataSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., vehicle, inspection, etc.
  folders: [folderSchema],
});

export default mongoose.model("MetaData", metaDataSchema);
