import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const createRelationship = factory.createOne(models.Relationship);

export const getRelationships = factory.getAll(models.Relationship);

export const getRelationship = factory.getOne(models.Relationship);

export const updateRelationship = factory.updateOne(models.Relationship);

export const deleteRelationship = factory.deleteOne(models.Relationship);

export const deleteRelationships = factory.deleteAll(models.Relationship);

export const updateRefs = factory.updateReference(models.Relationship);
