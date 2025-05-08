import express from "express";
import * as pageController from "../controllers/pageController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.use(authController.userProtect);

router
  .route("/")
  .post(pageController.createPage)
  .get(pageController.getPages)
  .delete(pageController.deletePages);

router
  .route("/:pageId")
  .get(pageController.getPage)
  .patch(pageController.updatePage)
  .delete(pageController.deletePage);

export default router;
