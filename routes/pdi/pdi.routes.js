import express from "express";
import {
  createPDIRequest,
  assignEngineer,
  getAllPDIRequests,
  updatePDIInspection,
} from "../../controllers/PDI/pdi.controller.js";

const router = express.Router();

router.post("/create", createPDIRequest);
// router.patch(
//   "/update/:id", 
//   upload.fields([
//     { name: "singleImage", maxCount: 1 },
//     { name: "multiImages", maxCount: 10 },
//   ]),
//   updatePDIInspection
// );
router.get("/all-request", getAllPDIRequests);
router.put("/assign/:bookingId", assignEngineer);

export default router;

//continue inspection form

//check all api and add validation for each api

//update pdi request api by id

//update pdi status api by id
