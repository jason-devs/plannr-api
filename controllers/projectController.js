import * as factory from "./controllerFactory.js";
import Project from "../models/projectModel.js";

export const createProject = factory.createOne(Project);
export const getProject = factory.getOne(Project, "projectId");
export const getProjects = factory.getAll(Project);
export const updateProject = factory.updateOne(Project, "projectId");
export const deleteProject = factory.deleteOne(Project, "projectId");
