import mongoose from "mongoose";
import * as factory from "./validatorFactory.js";
import Settings from "./Settings.js";

export const settings = new Settings({
  name: "component",
});

const componentSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `, true),

  //NOTE: References:

  project: factory.validReference(settings.name, "project"),

  //NOTE: Operational:

  createdBy: factory.validReference(settings.name, "user"),

  createdAt: {
    type: Date,
  },
});

componentSchema.staticSettings = settings;

componentSchema.pre("save", async function (next) {
  this.createdAt = new Date();
  next();
});

export default componentSchema;

/*

NOTE: Add the following to modelRegistry.js:

  import componentSchema from "./componentSchema.js"
  
  Component: mongoose.model("Component", roleSchema),

NOTE: And don't forget to add me to any DELETE logic in projectSchema.js

*/
