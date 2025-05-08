import mongoose from "mongoose";
import * as factory from "./validatorFactory.js";
import Settings from "./Settings.js";

export const settings = new Settings({
  name: "frontend stack",
});

const frontendStackSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `, true),

  //NOTE: References:

  project: factory.validReference(settings.name, "project", true, false, false),

  createdBy: factory.validReference(settings.name, "user"),

  //NOTE: Operational:

  createdAt: {
    type: Date,
  },
});

frontendStackSchema.staticSettings = settings;

frontendStackSchema.pre("save", async function (next) {
  this.createdAt = new Date();
  next();
});

export default frontendStackSchema;

/*

NOTE: Add the following to modelRegistry.js:

  import frontendStackSchema from "./frontendStackSchema.js"
  
  FrontendStack: mongoose.model("FrontendStack", frontendStackSchema),

*/
