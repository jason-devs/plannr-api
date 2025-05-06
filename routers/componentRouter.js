import express from "express";
import * as componentController from "../controllers/componentController.js";

const router = express.Router({ mergeParams: true });

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

router.route("/:componentId/refs").patch(componentController.updateRefs);

export default router;

/*

NOTE: Add these to app.js:

import componentRouter from "./routers/componentRouter.js";
projectRouter.use("/:projectId/component", componentRouter);

*/
