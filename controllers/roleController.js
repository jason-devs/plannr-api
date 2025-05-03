import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createRole = factory.createOne(models.Role);

export const getRoles = factory.getAll(models.Role);

export const getRole = factory.getOne(models.Role);

export const updateRole = factory.updateOne(models.Role);

export const deleteRole = factory.deleteOne(models.Role);

export const deleteRoles = factory.deleteAll(models.Role);
