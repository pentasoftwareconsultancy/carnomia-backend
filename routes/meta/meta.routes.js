import express from "express";
import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  deleteVehicle,
} from "../../controllers/meta/vehicleController.js";

const router = express.Router();

// Vehicle Routes
router.post("/vehicle", createVehicle);
router.get("/getallvehicle", getAllVehicles);
router.get("/:id", getVehicleById);
router.delete("/:id", deleteVehicle);

// Locations routes



// Meta Routes


export default router;