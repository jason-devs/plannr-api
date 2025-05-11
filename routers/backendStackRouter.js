import express from "express";
import * as backendStackController from "../controllers/backendStackController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.use(authController.userProtect);

router
  .route("/")
  .post(backendStackController.createBackendStack)
  .get(backendStackController.getBackendStacks)
  .delete(backendStackController.deleteBackendStacks);

router
  .route("/:backendStackId")
  .get(backendStackController.getBackendStack)
  .patch(backendStackController.updateBackendStack)
  .delete(backendStackController.deleteBackendStack);

export default router;

/*

NOTE: Add these to app.js:

import backendStackRouter from "./routers/backendStackRouter.js";
app.use(`/api/v1/backend-stack`, backendStackRouter);

*/
