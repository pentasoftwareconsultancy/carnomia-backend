import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getusers,
} from "../../controllers/User/user.controller.js";
import { verifyOtp } from "../../config/verifyOtp.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/verify-otp", verifyOtp);
router.get("/getallusers", getusers);

export default router;
