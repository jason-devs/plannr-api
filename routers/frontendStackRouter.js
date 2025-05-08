import express from "express";
import * as frontendStackController from "../controllers/frontendStackController.js";

const router = express.Router();

router
  .route("/")
  .post(frontendStackController.createFrontendStack)
  .get(frontendStackController.getFrontendStacks)
  .delete(frontendStackController.deleteFrontendStacks);

router
  .route("/:frontendStackId")
  .get(frontendStackController.getFrontendStack)
  .patch(frontendStackController.updateFrontendStack)
  .delete(frontendStackController.deleteFrontendStack);

export default router;

/*

NOTE: Add these to app.js:

import frontendStackRouter from "./routers/frontendStackRouter.js";
app.use(`/frontend-stack`, frontendStackRouter);

*/
