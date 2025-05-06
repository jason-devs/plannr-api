import express from "express";
import * as authController from "../controllers/authController.js";
import * as projectController from "../controllers/projectController.js";
import frontendRouter from "./frontendRouter.js";
import backendRouter from "./backendRouter.js";

const router = express.Router();

router.use(authController.userProtect);

router
  .route("/")
  .get(projectController.getProjects)
  .post(projectController.createProject)
  .delete(projectController.deleteProjects);

router
  .route("/:projectId")
  .get(projectController.getProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

router.use("/:projectId/front-end", frontendRouter);
router.use("/:projectId/back-end", backendRouter);

export default router;
