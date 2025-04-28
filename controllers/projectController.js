import * as factory from "./controllerFactory.js";
import Project from "../models/projectModel.js";

export const createProject = factory.createOne(Project);
export const getProjects = factory.getAll(Project);
export const getProject = factory.getOne(Project);
export const updateProject = factory.updateOne(Project);
export const deleteProject = factory.deleteOne(Project);
