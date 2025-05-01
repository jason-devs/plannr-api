import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createRole = factory.createOne(models.Role, "project");

export const getRoles = factory.getAll(models.Role, "project");

export const getRole = factory.getOne(models.Role, "role", "project");

export const updateRole = factory.updateOne(models.Role, "role", "project");

export const deleteRole = factory.deleteOne(models.Role, "role", "project");

export const deleteRoles = factory.deleteAll(models.Role, "project");
