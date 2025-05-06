import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createComponent = factory.createOne(models.Component);

export const getComponents = factory.getAll(models.Component);

export const getComponent = factory.getOne(models.Component);

export const updateComponent = factory.updateOne(models.Component);

export const deleteComponent = factory.deleteOne(models.Component);

export const deleteComponents = factory.deleteAll(models.Component);

export const updateRefs = factory.updateReference(models.Component);
