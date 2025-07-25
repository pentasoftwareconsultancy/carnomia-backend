import express from "express";
import {
  addLookup,
  deleteLookup,
  getLookupById,
  getLookups,
  updateLookup,
} from "../../controllers/meta/lookupController.js";

const router = express.Router();

router.get("/", getLookups);
router.get("/:id", getLookupById);
router.post("/add", addLookup);
router.post("/update/:id", updateLookup);
router.delete("/:id", deleteLookup);

export default router;
