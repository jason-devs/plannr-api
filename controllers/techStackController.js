import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createTechStack = factory.createOne(models.TechStack, "project");

export const getTechStacks = factory.getAll(models.TechStack, "project");

export const getTechStack = factory.getOne(
  models.TechStack,
  "tech stack",
  "project",
);

export const updateTechStack = factory.updateOne(
  models.TechStack,
  "tech stack",
  "project",
);

export const deleteTechStack = factory.deleteOne(
  models.TechStack,
  "tech stack",
  "project",
);

export const deleteTechStacks = factory.deleteAll(models.TechStack, "project");
