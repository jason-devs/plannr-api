import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createRole = factory.createOne(models.Role, "solo");

export const getRoles = factory.getAll(models.Role, "solo");

export const getRole = factory.getOne(models.Role, "role", "solo");

export const updateRole = factory.updateOne(models.Role, "role", "solo");

export const deleteRole = factory.deleteOne(models.Role, "role", "solo");

export const deleteRoles = factory.deleteAll(models.Role, "solo");
