
import multer from "multer";
import path from "path";
import fs from "fs";
import moment from "moment";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const currentYear = moment().format("YYYY");
    const documentType = req.body.documentType || "general";

    const uploadPath = path.join(process.cwd(), "uploads", currentYear, documentType);

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

export const uploadDocument = multer({ storage });