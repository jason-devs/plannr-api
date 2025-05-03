import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createPage = factory.createOne(models.Page);

export const getPages = factory.getAll(models.Page);

export const getPage = factory.getOne(models.Page);

export const updatePage = factory.updateOne(models.Page);

export const deletePage = factory.deleteOne(models.Page);

export const deletePages = factory.deleteAll(models.Page);
