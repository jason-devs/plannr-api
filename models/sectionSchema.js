import mongoose from "mongoose";
import * as factory from "./validatorFactory.js";
import Settings from "./Settings.js";

export const settings = new Settings({
  name: "section",
  overviewSel: "name description",
});

const sectionSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `, true),

  description: factory.validText(settings, "small", false),

  //NOTE: References:

  page: factory.validReference(settings.name, "page"),

  //NOTE: Operational:

  createdBy: factory.validReference(settings.name, "user"),

  createdAt: {
    type: Date,
  },
});

sectionSchema.staticSettings = settings;

sectionSchema.pre("save", async function (next) {
  this.createdAt = new Date();
  next();
});

export default sectionSchema;

/*

NOTE: Add the following to modelRegistry.js:

  import sectionSchema from "./sectionSchema.js"
  
  Section: mongoose.model("Section", sectionSchema),

NOTE: And don't forget to add me to any DELETE logic in projectSchema.js

*/
