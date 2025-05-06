import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createSection = factory.createOne(models.Section);

export const getSections = factory.getAll(models.Section);

export const getSection = factory.getOne(models.Section);

export const updateSection = factory.updateOne(models.Section);

export const deleteSection = factory.deleteOne(models.Section);

export const deleteSections = factory.deleteAll(models.Section);

export const updateRefs = factory.updateReference(models.Section);
