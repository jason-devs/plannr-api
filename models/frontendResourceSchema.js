import mongoose from "mongoose";
import * as factory from "./validatorFactory.js";
import Settings from "./Settings.js";

export const settings = new Settings({
  name: "frontend resource",
});

const frontendResourceSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `, true),

  //NOTE: References:

  project: factory.validReference(settings.name, "project", true, false, false),

  createdBy: factory.validReference(settings.name, "user"),

  //NOTE: Operational:

  createdAt: {
    type: Date,
  },
});

frontendResourceSchema.staticSettings = settings;

frontendResourceSchema.pre("save", async function (next) {
  this.createdAt = new Date();
  next();
});

export default frontendResourceSchema;

/*

NOTE: Add the following to modelRegistry.js:

  import frontendResourceSchema from "./frontendResourceSchema.js"
  
  FrontendResource: mongoose.model("FrontendResource", frontendResourceSchema),

*/
