import UserStory from "../models/userStoriesModel.js";
import * as factory from "./controllerFactory.js";

export const createUserStory = factory.createOne(
  UserStory,
  "project",
  "projectId",
);

export const getUserStories = factory.getAll(UserStory, "project", "projectId");

export const getUserStory = factory.getOne(
  UserStory,
  "userStoryId",
  "project",
  "projectId",
);

export const updateUserStory = factory.updateOne(
  UserStory,
  "userStoryId",
  "project",
  "projectId",
);

export const deleteUserStory = factory.deleteOne(
  UserStory,
  "userStoryId",
  "project",
  "projectId",
);

export const deleteUserStories = factory.deleteAll(
  UserStory,
  "project",
  "projectId",
);
