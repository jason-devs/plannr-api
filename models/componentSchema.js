import mongoose from "mongoose";
import * as relationships from "./relationships.js";
import * as factory from "./validatorFactory.js";

export const settings = {
  parent: "project",
  name: "component",
  privacy: "private",
  deleteType: "hard",
  overviewSel: "name",
  overviewPop: [],
  fullSel: "-__v -createdAt -createdBy",
  fullPop: [
    {
      path: "project",
      select: "name",
    },
  ],
};

const componentSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `, true),

  project: factory.validReference(settings.name, settings.parent),

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

componentSchema.post("findOneAndDelete", async function (component) {
  await relationships.afterDeleteOne(component);
});

componentSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany(this);
});

componentSchema.post("save", async function (component) {
  await relationships.afterAddOne(component);
});

export default componentSchema;

/*

NOTE: Add the following to modelRegistry.js:

  import componentSchema from "./componentSchema.js"
  
  Component: mongoose.model("Component", roleSchema),

NOTE: And don't forget to add me to any DELETE logic in projectSchema.js

*/
