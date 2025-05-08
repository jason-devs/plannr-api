import mongoose from "mongoose";
import * as factory from "./validatorFactory.js";
import Settings from "./Settings.js";

const settings = new Settings({
  name: "backend resource",
});

const backendResourceSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `),

  //NOTE: References:

  project: factory.validReference(settings.name, "project"),

  //NOTE: Operational:

  createdBy: factory.validReference(settings.name, "user"),

  createdAt: {
    type: Date,
  },
});

backendResourceSchema.staticSettings = settings;

backendResourceSchema.pre("save", async function (next) {
  this.createdAt = new Date();
  next();
});

export default backendResourceSchema;
