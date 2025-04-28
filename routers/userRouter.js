import express from "express";
import * as userController from "../controllers/userController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.use(authController.userProtect);

router
  .route("/my-account")
  .get(userController.getMyAccount)
  .patch(userController.updateMyAccount)
  .delete(userController.deleteMyAccount);

export default router;
