import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createBackendStack = factory.createOne(models.BackendStack);

export const getBackendStacks = factory.getAll(models.BackendStack);

export const getBackendStack = factory.getOne(models.BackendStack);

export const updateBackendStack = factory.updateOne(models.BackendStack);

export const deleteBackendStack = factory.deleteOne(models.BackendStack);

export const deleteBackendStacks = factory.deleteAll(models.BackendStack);
