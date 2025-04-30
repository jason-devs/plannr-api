import TechStack from "../models/techStackModel.js";
import * as factory from "./controllerFactory.js";

export const createTechStack = factory.createOne(
  TechStack,
  "project",
  "projectId",
);

export const getTechStacks = factory.getAll(TechStack, "project", "projectId");

export const getTechStack = factory.getOne(
  TechStack,
  "techStackId",
  "project",
  "projectId",
);

export const updateTechStack = factory.updateOne(
  TechStack,
  "techStackId",
  "project",
  "projectId",
);

export const deleteTechStack = factory.deleteOne(
  TechStack,
  "techStackId",
  "project",
  "projectId",
);

export const deleteTechStacks = factory.deleteAll(
  TechStack,
  "project",
  "projectId",
);
