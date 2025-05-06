import express from "express";
import * as relationshipController from "../controllers/relationshipController.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(relationshipController.createRelationship)
  .get(relationshipController.getRelationships)
  .delete(relationshipController.deleteRelationships);

router
  .route("/:relationshipId")
  .get(relationshipController.getRelationship)
  .patch(relationshipController.updateRelationship)
  .delete(relationshipController.deleteRelationship);

router.route("/:relationshipId/refs").patch(relationshipController.updateRefs);

export default router;

/*

NOTE: Add these to app.js:

import relationshipRouter from "./routers/relationshipRouter.js";
projectRouter.use("/:projectId/relationship", relationshipRouter);

*/
