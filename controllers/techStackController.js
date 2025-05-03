import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createTechStack = factory.createOne(models.TechStack);

export const getTechStacks = factory.getAll(models.TechStack);

export const getTechStack = factory.getOne(models.TechStack);

export const updateTechStack = factory.updateOne(models.TechStack);

export const deleteTechStack = factory.deleteOne(models.TechStack);

export const deleteTechStacks = factory.deleteAll(models.TechStack);
