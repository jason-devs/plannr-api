import express from "express";
import * as frontendController from "../controllers/frontendController.js";

const router = express.Router({ mergeParams: true });

router.route("/").get(frontendController.getFrontend);

router.route("/refs").patch(frontendController.updateRefs);

export default router;

/*

NOTE: Add these to app.js:

import frontendRouter from "./routers/frontendRouter.js";
projectRouter.use("/:projectId/frontend", frontendRouter);

*/
