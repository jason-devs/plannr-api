import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createTech = factory.createOne(models.Tech);

export const getTechs = factory.getAll(models.Tech);

export const getTech = factory.getOne(models.Tech);

export const updateTech = factory.updateOne(models.Tech);

export const deleteTech = factory.deleteOne(models.Tech);

export const deleteTechs = factory.deleteAll(models.Tech);
