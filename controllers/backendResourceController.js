import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createBackendResource = factory.createOne(models.BackendResource);

export const getBackendResources = factory.getAll(models.BackendResource);

export const getBackendResource = factory.getOne(models.BackendResource);

export const updateBackendResource = factory.updateOne(models.BackendResource);

export const deleteBackendResource = factory.deleteOne(models.BackendResource);

export const deleteBackendResources = factory.deleteAll(models.BackendResource);
