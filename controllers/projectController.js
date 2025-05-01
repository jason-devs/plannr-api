import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createProject = factory.createOne(models.Project);
export const getProject = factory.getOne(models.Project, "project");
export const getProjects = factory.getAll(models.Project);
export const updateProject = factory.updateOne(models.Project, "project");
export const deleteProject = factory.deleteOne(models.Project, "project");
