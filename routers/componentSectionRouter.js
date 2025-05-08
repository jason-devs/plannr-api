import express from "express";
import * as componentSectionController from "../controllers/componentSectionController.js";

const router = express.Router();

router
  .route("/")
  .post(componentSectionController.createComponentSection)
  .get(componentSectionController.getComponentSections)
  .delete(componentSectionController.deleteComponentSections);

router
  .route("/:componentSectionId")
  .get(componentSectionController.getComponentSection)
  .patch(componentSectionController.updateComponentSection)
  .delete(componentSectionController.deleteComponentSection);

export default router;

/*

NOTE: Add these to app.js:

import componentSectionRouter from "./routers/componentSectionRouter.js";
app.use(`/component-section`, componentSectionRouter);

*/
