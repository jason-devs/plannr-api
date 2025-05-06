import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const getFrontend = factory.getOneEmbedded(models.Frontend);

export const updateRefs = factory.updateReference(models.Frontend);
