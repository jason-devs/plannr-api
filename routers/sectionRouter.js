import express from "express";
import * as sectionController from "../controllers/sectionController.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(sectionController.createSection)
  .get(sectionController.getSections)
  .delete(sectionController.deleteSections);

router
  .route("/:sectionId")
  .get(sectionController.getSection)
  .patch(sectionController.updateSection)
  .delete(sectionController.deleteSection);

router.route("/:sectionId/refs").patch(sectionController.updateRefs);

export default router;

/*

NOTE: Add these to app.js:

import sectionRouter from "./routers/sectionRouter.js";
projectRouter.use("/:projectId/section", sectionRouter);

*/
