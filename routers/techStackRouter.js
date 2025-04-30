import express from "express";
import * as techStackController from "../controllers/techStackController.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(techStackController.createTechStack)
  .get(techStackController.getTechStacks)
  .delete(techStackController.deleteTechStacks);

router
  .route("/:techStackId")
  .get(techStackController.getTechStack)
  .patch(techStackController.updateTechStack)
  .delete(techStackController.deleteTechStack);

export default router;
