import express from "express";
import * as frontendResourceController from "../controllers/frontendResourceController.js";

const router = express.Router();

router
  .route("/")
  .post(frontendResourceController.createFrontendResource)
  .get(frontendResourceController.getFrontendResources)
  .delete(frontendResourceController.deleteFrontendResources);

router
  .route("/:frontendResourceId")
  .get(frontendResourceController.getFrontendResource)
  .patch(frontendResourceController.updateFrontendResource)
  .delete(frontendResourceController.deleteFrontendResource);

export default router;

/*

NOTE: Add these to app.js:

import frontendResourceRouter from "./routers/frontendResourceRouter.js";
app.use("/frontend-resource", frontendResourceRouter);

*/
