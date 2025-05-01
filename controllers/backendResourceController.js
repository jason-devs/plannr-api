import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createBackendResource = factory.createOne(
  models.BackendResource,
  "project",
);

export const getBackendResources = factory.getAll(
  models.BackendResource,
  "project",
);

export const getBackendResource = factory.getOne(
  models.BackendResource,
  "backend resource",
  "project",
);

export const updateBackendResource = factory.updateOne(
  models.BackendResource,
  "backend resource",
  "project",
);

export const deleteBackendResource = factory.deleteOne(
  models.BackendResource,
  "backend resource",
  "project",
);

export const deleteBackendResources = factory.deleteAll(
  models.BackendResource,
  "project",
);
