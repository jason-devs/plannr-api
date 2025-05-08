import express from "express";
import * as userStoriesController from "../controllers/userStoriesController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.use(authController.userProtect);

router
  .route("/")
  .get(userStoriesController.getUserStories)
  .post(userStoriesController.createUserStory)
  .delete(userStoriesController.deleteUserStories);

router
  .route("/:userStoryId")
  .get(userStoriesController.getUserStory)
  .patch(userStoriesController.updateUserStory)
  .delete(userStoriesController.deleteUserStory);

export default router;
