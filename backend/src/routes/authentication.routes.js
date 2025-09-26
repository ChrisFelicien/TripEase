import express from "express";
import {
  loginUser,
  signupUser,
  protect,
  changePassword,
  getMe
} from "./../middlewares/authentication.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/change-password", protect, changePassword);
router.get("/me", protect, getMe);

export default router;
