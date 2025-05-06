import mongoose from "mongoose";
import * as relationships from "./relationships.js";
import * as factory from "./validatorFactory.js";

export const settings = {
  parent: "page",
  name: "section",
  privacy: "private",
  deleteType: "hard",
  overviewSel: "name",
  overviewPop: [],
  fullSel: "-__v -createdAt -createdBy",
  fullPop: [],
};

const sectionSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `, true),

  page: factory.validReference(settings.name, settings.parent),

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

sectionSchema.post("findOneAndDelete", async function (section) {
  await relationships.afterDeleteOne(section);
});

sectionSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany(this);
});

sectionSchema.post("save", async function (section) {
  await relationships.afterAddOne(section);
});

export default sectionSchema;

/*

NOTE: Add the following to modelRegistry.js:

  import sectionSchema from "./sectionSchema.js"
  
  Section: mongoose.model("Section", sectionSchema),

NOTE: And don't forget to add me to any DELETE logic in projectSchema.js

*/
