import express from "express";
import * as authController from "../controllers/authController.js";
import * as projectController from "../controllers/projectController.js";

const router = express.Router();

router.use(authController.userProtect);

router
  .route("/")
  .get(projectController.getProjects)
  .post(projectController.createProject);

router
  .route("/:projectId")
  .get(projectController.getProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

export default router;
