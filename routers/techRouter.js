import express from "express";
import * as techController from "../controllers/techController.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(techController.createTech)
  .get(techController.getTechs)
  .delete(techController.deleteTechs);

router
  .route("/:techId")
  .get(techController.getTech)
  .patch(techController.updateTech)
  .delete(techController.deleteTech);

export default router;
