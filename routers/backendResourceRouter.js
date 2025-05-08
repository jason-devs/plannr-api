import express from "express";
import * as backendResourceController from "../controllers/backendResourceController.js";

const router = express.Router();

router
  .route("/")
  .post(backendResourceController.createBackendResource)
  .get(backendResourceController.getBackendResources)
  .delete(backendResourceController.deleteBackendResources);

router
  .route("/:backendResourceId")
  .get(backendResourceController.getBackendResource)
  .patch(backendResourceController.updateBackendResource)
  .delete(backendResourceController.deleteBackendResource);

export default router;
