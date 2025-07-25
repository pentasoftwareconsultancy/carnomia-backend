import express from "express";
import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  deleteVehicle,
} from "../../controllers/meta/vehicleController.js";
import { uploadDocument } from "../../controllers/meta/commonController.js";

const router = express.Router();

// Vehicle Routes
router.post(
  "/vehicle",

  uploadDocument.single("image"),
  createVehicle
);
router.get("/getallvehicle", getAllVehicles);
router.get("/:id", getVehicleById);
router.delete("/:id", deleteVehicle);

// Locations routes

// Meta Routes

export default router;
