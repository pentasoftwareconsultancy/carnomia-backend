// import express from "express";
// import { deleteMetaData, getMetaDataByType, updateMetaData, uploadDocument, upsertMetaData } from "../../controllers/meta/commonController.js";
// import path from "path";

// const router = express.Router();

// // Upload image route
// router.post("/upload", uploadDocument.array("documents", 100), (req, res) => {
//   try {
//     const documentType = req.body.documentType || "general";
//     const baseUrl = `${req.protocol}://${req.get("host")}`;

//     const uploadedFiles = req.files.map(file => {
//     const filePath = path.relative(process.cwd(), file.path).replace(/\\/g, "/");
//     const fullUrl = `${req.protocol}://${req.get("host")}/${filePath}`;

//       return {
//         fileName: file.originalname,
//         fileUrl: fullUrl,
//         documentType: documentType,
//       };
//     });

//     res.json({
//       status: "success",
//       message: "Documents uploaded successfully",
//       files: uploadedFiles,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       status: "error",
//       message: "Document upload failed",
//     });
//   }
// });

// router.post('/meta', upsertMetaData);              
// router.get('/meta/:type', getMetaDataByType);
// router.put('/meta', updateMetaData);   
// router.delete('/meta', deleteMetaData);    


// export default router;


import express from "express";
import {
  deleteMetaData,
  getMetaDataByType,
  updateMetaData,
  uploadDocument,
  upsertMetaData,
} from "../../controllers/meta/commonController.js";

const router = express.Router();

// // Upload image route

// router.post("/upload", uploadDocument.array("documents", 100), (req, res) => {
//   try {
//     const documentType = req.body.documentType || "general";
//     const baseUrl = `${req.protocol}://${req.get("host")}`;

//     const uploadedFiles = req.files.map((file) => {
//       // ✅ Correct file URL (assuming uploads are served via express.static)
//       const fileUrl = `${baseUrl}/uploads/${file.filename}`;

//       return {
//         fileName: file.originalname,
//         fileUrl,
//         documentType,
//       };
//     });

//     res.json({
//       status: "success",
//       message: "Documents uploaded successfully",
//       files: uploadedFiles,
//     });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({
//       status: "error",
//       message: "Document upload failed",
//     });
//   }
// });

router.post("/upload", uploadDocument.array("documents", 100), (req, res) => {
  try {
    const documentType = req.body.documentType || "general";

    // Detect HTTPS in production
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://api.carnomia.com"
        // : `${req.protocol}://${req.get("host")}`;
        : `${req.protocol}://${req.get("host")}`;

        console.log("ENV", process.env.NODE_ENV);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No files uploaded",
      });
    }

    const uploadedFiles = req.files.map((file) => {
      const fileUrl = `${baseUrl}/uploads/${file.filename}`;
      return {
        fileName: file.originalname,
        fileUrl,
        documentType,
      };
    });

    res.json({
      status: "success",
      message: "Documents uploaded successfully",
      files: uploadedFiles,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      status: "error",
      message: "Document upload failed",
    });
  }
});

// Meta routes
router.post("/meta", upsertMetaData);
router.get("/meta/:type", getMetaDataByType);
router.put("/meta", updateMetaData);
router.delete("/meta", deleteMetaData);

export default router;
