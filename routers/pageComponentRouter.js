import express from "express";
import * as pageComponentController from "../controllers/pageComponentController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.use(authController.userProtect);

router
  .route("/")
  .post(pageComponentController.createPageComponent)
  .get(pageComponentController.getPageComponents)
  .delete(pageComponentController.deletePageComponents);

router
  .route("/:pageComponentId")
  .get(pageComponentController.getPageComponent)
  .patch(pageComponentController.updatePageComponent)
  .delete(pageComponentController.deletePageComponent);

export default router;

/*

NOTE: Add these to app.js:

import pageComponentRouter from "./routers/pageComponentRouter.js";
projectRouter.use("/:noneId/page-component", pageComponentRouter);

*/
