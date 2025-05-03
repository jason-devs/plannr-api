import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createProject = factory.createOne(models.Project);

export const getProject = factory.getOne(models.Project);

export const getProjects = factory.getAll(models.Project);

export const updateProject = factory.updateOne(models.Project);

export const deleteProject = factory.deleteOne(models.Project);

export const deleteProjects = factory.deleteAll(models.Project);
