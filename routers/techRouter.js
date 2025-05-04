import express from "express";
import * as authController from "../controllers/authController.js";
import * as techController from "../controllers/techController.js";

const router = express.Router();

router.use(authController.userProtect);

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
