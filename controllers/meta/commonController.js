import multer from "multer";
import path from "path";
import fs from "fs";
import moment from "moment";
import MetaData from "../../models/MetaData.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const currentYear = moment().format("YYYY");
    const documentType = req.body.documentType || "general";

    const uploadPath = path.join(
      process.cwd(),
      "uploads",
      currentYear,
      documentType
    );

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

export const uploadDocument = multer({ storage });

// Create or update dropdown folder data
export const upsertMetaData = async (req, res) => {
  const { value, type, folderName } = req.body;

  if (!value || !type || !folderName) {
    return res
      .status(400)
      .json({ message: "value, type, and folderName are required" });
  }

  const label = value.charAt(0).toUpperCase() + value.slice(1); // Capitalize

  try {
    let meta = await MetaData.findOne({ type });

    if (meta) {
      const folderIndex = meta.folders.findIndex(
        (f) => f.folderName === folderName
      );
      if (folderIndex > -1) {
        const exists = meta.folders[folderIndex].fields.some(
          (f) => f.value === value
        );
        if (!exists) {
          meta.folders[folderIndex].fields.push({ label, value });
        } else {
          return res.status(409).json({ message: "Value already exists" });
        }
      } else {
        meta.folders.push({ folderName, fields: [{ label, value }] });
      }
    } else {
      meta = new MetaData({
        type,
        folders: [{ folderName, fields: [{ label, value }] }],
      });
    }

    await meta.save();
    res.status(200).json({ message: "Value added", data: meta });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all dropdowns by type
export const getMetaDataByType = async (req, res) => {
  const { type } = req.params;

  try {
    const meta = await MetaData.findOne({ type });
    if (!meta) return res.status(404).json({ message: "Meta data not found" });

    res.status(200).json(meta.folders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching meta data", error: err.message });
  }
};

// update dropdwon data
export const updateMetaData = async (req, res) => {
  const { type, folderName, oldValue, newValue } = req.body;

  try {
    const meta = await MetaData.findOne({ type });
    if (!meta) return res.status(404).json({ message: "Meta data not found" });

    const folder = meta.folders.find((f) => f.folderName === folderName);
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    const field = folder.fields.find((f) => f.value === oldValue);
    if (!field) return res.status(404).json({ message: "Field not found" });

    field.label = newValue;
    field.value = newValue;

    await meta.save();
    res.status(200).json({ message: "Field updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// delete dropdowun field
export const deleteMetaData = async (req, res) => {
  const { type, folderName, value } = req.body;

  try {
    const meta = await MetaData.findOne({ type });
    if (!meta) return res.status(404).json({ message: "Meta data not found" });

    const folder = meta.folders.find((f) => f.folderName === folderName);
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    folder.fields = folder.fields.filter((f) => f.value !== value);
    await meta.save();

    res.status(200).json({ message: "Field deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
