import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createFrontendResource = factory.createOne(
  models.FrontendResource,
);

export const getFrontendResources = factory.getAll(models.FrontendResource);

export const getFrontendResource = factory.getOne(models.FrontendResource);

export const updateFrontendResource = factory.updateOne(
  models.FrontendResource,
);

export const deleteFrontendResource = factory.deleteOne(
  models.FrontendResource,
);

export const deleteFrontendResources = factory.deleteAll(
  models.FrontendResource,
);
