import express from "express";
import * as dataModelController from "../controllers/dataModelController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router({ mergeParams: true });

router.use(authController.userProtect);

router
  .route("/")
  .post(dataModelController.createDataModel)
  .get(dataModelController.getDataModels)
  .delete(dataModelController.deleteDataModels);

router
  .route("/:dataModelId")
  .get(dataModelController.getDataModel)
  .patch(dataModelController.updateDataModel)
  .delete(dataModelController.deleteDataModel);

export default router;

/*

NOTE: Add these to app.js:

import dataModelRouter from "./routers/dataModelRouter.js";
projectRouter.use("/:projectId/data-model", dataModelRouter);

*/
