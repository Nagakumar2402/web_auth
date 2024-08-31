import { Router } from "express";
import multer from "multer";
import {
  registerUser,
  loginUser,
  registerChallenge,
  verifyRegistration,
  loginChallenge,
  verifyLogin,
} from "../controller/User.controller.js";

const router = Router();
const upload = multer(); // Initialize multer middleware

router.route("/register").post(upload.none(), registerUser);
// Use 'upload.none()' to handle fields only without files
router.route("/login").post(loginUser);
router.route("/register-challenge").post(registerChallenge);
router.route("/register-verify").post(verifyRegistration);
router.route("/login-challenge").post(loginChallenge);
router.route("/login-verify").post(verifyLogin);

export default router;
