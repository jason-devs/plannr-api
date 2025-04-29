import express from "express";
import * as pageController from "../controllers/pageController.js";

const router = express.Router({ mergeParams: true });

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
