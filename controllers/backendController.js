import * as factory from "./controllerFactory.js";
import models from "../models/modelRegistry.js";

export const getBackend = factory.getOneEmbedded(models.Backend);

export const updateRefs = factory.updateReference(models.Backend);
