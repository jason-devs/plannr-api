import express from "express";
import * as roleController from "../controllers/roleController.js";

const router = express.Router({ mergeParams: true });

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
