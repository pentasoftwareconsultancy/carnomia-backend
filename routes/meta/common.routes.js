import express from "express";
import { uploadDocument } from "../../controllers/meta/commonController.js";
import path from "path";

const router = express.Router();

// Upload image route
router.post("/upload", uploadDocument.array("documents", 10), (req, res) => {
  try {
    const documentType = req.body.documentType || "general";
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const uploadedFiles = req.files.map(file => {
    const filePath = path.relative(process.cwd(), file.path).replace(/\\/g, "/");
    const fullUrl = `${req.protocol}://${req.get("host")}/${filePath}`;

      return {
        fileName: file.originalname,
        fileUrl: fullUrl,
        documentType: documentType,
      };
    });

    res.json({
      status: "success",
      message: "Documents uploaded successfully",
      files: uploadedFiles,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Document upload failed",
    });
  }
});


export default router;
