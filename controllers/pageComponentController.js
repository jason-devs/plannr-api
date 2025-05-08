import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createPageComponent = factory.createOne(models.PageComponent);

export const getPageComponents = factory.getAll(models.PageComponent);

export const getPageComponent = factory.getOne(models.PageComponent);

export const updatePageComponent = factory.updateOne(models.PageComponent);

export const deletePageComponent = factory.deleteOne(models.PageComponent);

export const deletePageComponents = factory.deleteAll(models.PageComponent);

export const updateRefs = factory.updateReference(models.PageComponent);
