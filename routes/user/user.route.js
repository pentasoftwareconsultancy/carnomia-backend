import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getusers,
  getUsersByRoles,
  updateUser,
  deleteUser
} from "../../controllers/User/user.controller.js";
import { verifyOtp } from "../../config/verifyOtp.js";

const router = express.Router();

router.post("/register", registerUser);
router.patch("/update/:id", updateUser);
router.get("/getUsersByRoles/:role", getUsersByRoles);
router.delete("/delete/:id",deleteUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/verify-otp", verifyOtp);
router.get("/getallusers", getusers);

export default router;
