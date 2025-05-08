import mongoose from "mongoose";
import * as factory from "./validatorFactory.js";
import Settings from "./Settings.js";

export const settings = new Settings({
  name: "component section",
});

const componentSectionSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `, true),

  createdBy: factory.validReference(settings.name, "user"),

  createdAt: {
    type: Date,
  },
});

componentSectionSchema.staticSettings = settings;

componentSectionSchema.pre("save", async function (next) {
  this.createdAt = new Date();
  next();
});

export default componentSectionSchema;

/*

NOTE: Add the following to modelRegistry.js:

  import componentSectionSchema from "./componentSectionSchema.js"
  
  ComponentSection: mongoose.model("ComponentSection", componentSectionSchema),

*/
