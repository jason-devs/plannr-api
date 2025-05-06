import express from "express";
import * as backendController from "../controllers/backendController.js";

const router = express.Router({ mergeParams: true });

router.route("/").get(backendController.getBackend);

router.route("/refs").patch(backendController.updateRefs);

export default router;

/*

NOTE: Add these to app.js:

import backendRouter from "./routers/backendRouter.js";
projectRouter.use("/:projectId/backend", backendRouter);

*/
