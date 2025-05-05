import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createUserStory = factory.createOne(models.UserStory);

export const getUserStories = factory.getAll(models.UserStory);

export const getUserStory = factory.getOne(models.UserStory);

export const updateUserStory = factory.updateOne(models.UserStory);

export const deleteUserStory = factory.deleteOne(models.UserStory);

export const deleteUserStories = factory.deleteAll(models.UserStory);

export const updateRefs = factory.updateReference(models.UserStory);
