import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createFrontendStack = factory.createOne(models.FrontendStack);

export const getFrontendStacks = factory.getAll(models.FrontendStack);

export const getFrontendStack = factory.getOne(models.FrontendStack);

export const updateFrontendStack = factory.updateOne(models.FrontendStack);

export const deleteFrontendStack = factory.deleteOne(models.FrontendStack);

export const deleteFrontendStacks = factory.deleteAll(models.FrontendStack);
