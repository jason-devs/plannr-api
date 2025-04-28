import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.route("/generate-api-key").get(authController.generateApiKey);
router.route("/signup").post(authController.signup);
router.route("/forgot-password").post(authController.forgotPassword);
router.route("/reset-password/:resetToken").post(authController.resetPassword);
router.route("/login").post(authController.login);
router.use(authController.userProtect);
router.route("/logout").get(authController.logout);
router.route("/update-password").patch(authController.updatePassword);

export default router;
