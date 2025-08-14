import express from "express";
import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  deleteVehicle,
  updateVehicle,
} from "../../controllers/meta/vehicleController.js";
import { 
  createLocation, 
  deleteLocation, 
  getLocations, 
  updateLocation,
} from "../../controllers/meta/locationController.js";
import { submitInquiry } from "../../controllers/meta/inquiryController.js";

const router = express.Router();

//Location Routes
router.post("/createLocations", createLocation);
router.get("/getLocations", getLocations);
router.put("/updateLocations", updateLocation);
router.delete("/deleteLocations/:name", deleteLocation);

// Vehicle Routes
router.post("/vehicle",createVehicle);
router.get("/getallvehicle", getAllVehicles);
router.get("/:id", getVehicleById);
router.patch("/updateVehicle/:id", updateVehicle);
router.delete("/deleteVehicle/:id", deleteVehicle);

// Inquiry Routes
router.post("/submit-inquiry", submitInquiry);


export default router;
