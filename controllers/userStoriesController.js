import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createUserStory = factory.createOne(models.UserStory, "project");

export const getUserStories = factory.getAll(models.UserStory, "project");

export const getUserStory = factory.getOne(
  models.UserStory,
  "user story",
  "project",
);

export const updateUserStory = factory.updateOne(
  models.UserStory,
  "user story",
  "project",
);

export const deleteUserStory = factory.deleteOne(
  models.UserStory,
  "user story",
  "project",
);

export const deleteUserStories = factory.deleteAll(models.UserStory, "project");
