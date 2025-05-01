import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createCustomRole = factory.createOne(models.CustomRole, "project");

export const getCustomRoles = factory.getAll(models.CustomRole, "project");

export const getCustomRole = factory.getOne(
  models.CustomRole,
  "custom role",
  "project",
);

export const updateCustomRole = factory.updateOne(
  models.CustomRole,
  "custom role",
  "project",
);

export const deleteCustomRole = factory.deleteOne(
  models.CustomRole,
  "custom role",
  "project",
);

export const deleteCustomRoles = factory.deleteAll(
  models.CustomRole,
  "project",
);
