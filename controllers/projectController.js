import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createProject = factory.createOne(models.Project, "user");
export const getProject = factory.getOne(models.Project, "project", "user");
export const getProjects = factory.getAll(models.Project, "project", "user");
export const updateProject = factory.updateOne(
  models.Project,
  "project",
  "user",
);
export const deleteProject = factory.deleteOne(
  models.Project,
  "project",
  "user",
);
