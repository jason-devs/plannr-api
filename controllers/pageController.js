import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createPage = factory.createOne(models.Page, "project");

export const getPages = factory.getAll(models.Page, "project");

export const getPage = factory.getOne(models.Page, "page", "project");

export const updatePage = factory.updateOne(models.Page, "page", "project");

export const deletePage = factory.deleteOne(models.Page, "page", "project");

export const deletePages = factory.deleteAll(models.Page, "project");
