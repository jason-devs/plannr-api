import express from "express";
import * as componentController from "../controllers/componentController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.use(authController.userProtect);

router
  .route("/")
  .post(componentController.createComponent)
  .get(componentController.getComponents)
  .delete(componentController.deleteComponents);

router
  .route("/:componentId")
  .get(componentController.getComponent)
  .patch(componentController.updateComponent)
  .delete(componentController.deleteComponent);

export default router;

/*

NOTE: Add these to app.js:

import componentRouter from "./routers/componentRouter.js";
projectRouter.use("/:projectId/component", componentRouter);

*/
