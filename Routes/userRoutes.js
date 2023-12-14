import express from "express";
import {
  activateAccount,
  forgotPassword,
  getAllOTP,
  getAllUsers,
  Login,
  LogOut,
  Register,
  updatePassword,
  verifyOTP,
} from "../Controllers/Auth.js";
import { postAiCalls } from "../Controllers/Ai.js";
const router = express.Router();

router.post("/register", Register);
router.post("/activate-acount/:activationToken", activateAccount);
router.post("/login", Login);
router.get("/logout", LogOut);
router.post("/forgot-password", forgotPassword); //Just grabs the email of the user
router.post("/update-password/:id", updatePassword);
router.put("/verifyOtp", verifyOTP);
router.get("/get-all", getAllUsers);
router.get("/get-all-otp", getAllOTP);

// AI Routes
router.post("/completions", postAiCalls);

export default router;
