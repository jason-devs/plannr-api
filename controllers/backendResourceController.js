import BackendResource from "../models/backendResourceModel.js";
import * as factory from "./controllerFactory.js";

export const createBackendResource = factory.createOne(
  BackendResource,
  "project",
  "projectId",
);

export const getBackendResources = factory.getAll(
  BackendResource,
  "project",
  "projectId",
);

export const getBackendResource = factory.getOne(
  BackendResource,
  "backendResourceId",
  "project",
  "projectId",
);

export const updateBackendResource = factory.updateOne(
  BackendResource,
  "backendResourceId",
  "project",
  "projectId",
);

export const deleteBackendResource = factory.deleteOne(
  BackendResource,
  "backendResourceId",
  "project",
  "projectId",
);

export const deleteBackendResources = factory.deleteAll(
  BackendResource,
  "project",
  "projectId",
);
