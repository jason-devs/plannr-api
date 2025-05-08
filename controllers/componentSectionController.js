import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createComponentSection = factory.createOne(models.ComponentSection);

export const getComponentSections = factory.getAll(models.ComponentSection);

export const getComponentSection = factory.getOne(models.ComponentSection);

export const updateComponentSection = factory.updateOne(models.ComponentSection);

export const deleteComponentSection = factory.deleteOne(models.ComponentSection);

export const deleteComponentSections = factory.deleteAll(models.ComponentSection);
