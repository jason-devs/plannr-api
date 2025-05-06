import express from "express";
import * as userStoriesController from "../controllers/userStoriesController.js";

const router = express.Router({ mergeParams: true });

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

router.route("/:userStoryId/refs").patch(userStoriesController.updateRefs);

export default router;
