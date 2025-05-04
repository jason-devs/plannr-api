import express from "express";
import * as authController from "../controllers/authController.js";
import * as projectController from "../controllers/projectController.js";

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

router.route("/:projectId/:techId").patch(projectController.updateTech);

export default router;
