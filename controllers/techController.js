import Tech from "../models/techModel.js";
import * as factory from "./controllerFactory.js";

export const createTech = factory.createOne(Tech, "techStack", "techStackId");

export const getTechs = factory.getAll(Tech, "techStack", "techStackId");

export const getTech = factory.getOne(
  Tech,
  "techId",
  "techStack",
  "techStackId",
);

export const updateTech = factory.updateOne(
  Tech,
  "techId",
  "techStack",
  "techStackId",
);

export const deleteTech = factory.deleteOne(
  Tech,
  "techId",
  "techStack",
  "techStackId",
);

export const deleteTechs = factory.deleteAll(Tech, "techStack", "techStackId");
