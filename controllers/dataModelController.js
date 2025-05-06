import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createDataModel = factory.createOne(models.DataModel);

export const getDataModels = factory.getAll(models.DataModel);

export const getDataModel = factory.getOne(models.DataModel);

export const updateDataModel = factory.updateOne(models.DataModel);

export const deleteDataModel = factory.deleteOne(models.DataModel);

export const deleteDataModels = factory.deleteAll(models.DataModel);

export const updateRefs = factory.updateReference(models.DataModel);
