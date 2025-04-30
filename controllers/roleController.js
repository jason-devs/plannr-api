import Role from "../models/roleModel.js";
import * as factory from "./controllerFactory.js";

export const createRole = factory.createOne(Role, "project", "projectId");

export const getRoles = factory.getAll(Role, "project", "projectId");

export const getRole = factory.getOne(Role, "roleId", "project", "projectId");

export const updateRole = factory.updateOne(
  Role,
  "roleId",
  "project",
  "projectId",
);

export const deleteRole = factory.deleteOne(
  Role,
  "roleId",
  "project",
  "projectId",
);

export const deleteRoles = factory.deleteAll(Role, "project", "projectId");
