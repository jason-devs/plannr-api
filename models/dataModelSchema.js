import mongoose from "mongoose";
import * as factory from "./validatorFactory.js";
import Settings from "./Settings.js";

export const settings = new Settings({
  name: "data model",
});

const dataModelSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `, true),

  //NOTE: References:

  project: factory.validReference(settings.name, "project"),

  //NOTE: Operational:

  createdBy: factory.validReference(settings.name, "user"),

  createdAt: {
    type: Date,
  },
});

dataModelSchema.staticSettings = settings;

dataModelSchema.pre("save", async function (next) {
  this.createdAt = new Date();
  next();
});

export default dataModelSchema;

/*

NOTE: Add the following to modelRegistry.js:

  import dataModelSchema from "./dataModelSchema.js"
  
  DataModel: mongoose.model("DataModel", dataModelSchema),

NOTE: And don't forget to add me to any DELETE logic in projectSchema.js

*/
