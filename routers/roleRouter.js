import express from "express";
import * as authController from "../controllers/authController.js";
import * as roleController from "../controllers/roleController.js";

const router = express.Router();

router.use(authController.userProtect);

router
  .route("/")
  .post(roleController.createRole)
  .get(roleController.getRoles)
  .delete(roleController.deleteRoles);

router
  .route("/:roleId")
  .get(roleController.getRole)
  .patch(roleController.updateRole)
  .delete(roleController.deleteRole);

export default router;
