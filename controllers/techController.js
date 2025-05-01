import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createTech = factory.createOne(models.Tech, "tech stack");

export const getTechs = factory.getAll(models.Tech, "tech stack");

export const getTech = factory.getOne(models.Tech, "tech", "tech stack");

export const updateTech = factory.updateOne(models.Tech, "tech", "tech stack");

export const deleteTech = factory.deleteOne(models.Tech, "tech", "tech stack");

export const deleteTechs = factory.deleteAll(models.Tech, "tech stack");
