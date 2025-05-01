import express from "express";
import * as customRoleController from "../controllers/customRoleController.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(customRoleController.createCustomRole)
  .get(customRoleController.getCustomRoles)
  .delete(customRoleController.deleteCustomRoles);

router
  .route("/:customRoleId")
  .get(customRoleController.getCustomRole)
  .patch(customRoleController.updateCustomRole)
  .delete(customRoleController.deleteCustomRole);

export default router;
