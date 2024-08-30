import { Router } from "express";
import multer from "multer";
import {
  registerUser,
  loginUser,
  registerChallenge,
} from "../controller/User.controller.js";

const router = Router();
const upload = multer(); // Initialize multer middleware

router.route("/register").post(upload.none(), registerUser);
// Use 'upload.none()' to handle fields only without files
router.route("/login").post(loginUser);
router.route("/register-challenge").post(registerChallenge);

export default router;
