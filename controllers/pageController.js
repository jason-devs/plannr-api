import Page from "../models/pageModel.js";
import * as factory from "./controllerFactory.js";

export const createPage = factory.createOne(Page, "project", "projectId");

export const getPages = factory.getAll(Page, "project", "projectId");

export const getPage = factory.getOne(Page, "pageId", "project", "projectId");

export const updatePage = factory.updateOne(
  Page,
  "pageId",
  "project",
  "projectId",
);

export const deletePage = factory.deleteOne(
  Page,
  "pageId",
  "project",
  "projectId",
);

export const deletePages = factory.deleteAll(Page, "project", "projectId");
