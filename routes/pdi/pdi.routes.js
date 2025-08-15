import express from "express";
import {
  createPDIRequest,
  assignEngineer,
  getAllPDIRequests,
  getPDIRequestsByEngineer,
  updateInspectionById,
  getPDIRequestsByStatuses,
  getPDIRequestCountsByStatuses,
  getRecentRequestByCustomer,
  updatePaymentStatus,
  getPDIRequestById,
  getSelectedPDIWithVehicleData,
} from "../../controllers/PDI/pdi.controller.js";
import authMiddlewares from "../../middleware/authMiddleware.js";
import { uploadDocument } from './../../controllers/meta/commonController.js';

const router = express.Router();

router.post("/create", authMiddlewares, createPDIRequest);
// router.patch(
//   "/update/:id", 
//   upload.fields([
//     { name: "singleImage", maxCount: 1 },
//     { name: "multiImages", maxCount: 10 },
//   ]),
//   updatePDIInspection
// );
router.get("/request", getAllPDIRequests);
router.get("/request-by-id/:id", getPDIRequestById);
router.get("/request-by-engineer/:engineerId", authMiddlewares, getPDIRequestsByEngineer);
router.post("/requests/statuses", authMiddlewares, getPDIRequestsByStatuses);
router.post("/requests/requests-count", getPDIRequestCountsByStatuses);
router.get("/customer/recent", authMiddlewares, getRecentRequestByCustomer);
router.put("/request/payment-status/:id",authMiddlewares, updatePaymentStatus);

router.put(
  "/request/updateInspectionById/:id",
  updateInspectionById
);
router.put("/request/assign", assignEngineer);
router.get("/PDIRequestwithvehicledata", getSelectedPDIWithVehicleData);

export default router;

//continue inspection form

//check all api and add validation for each api

//update pdi request api by id

//update pdi status api by id
