import mongoose from "mongoose";
import * as relationships from "./relationships.js";
import * as factory from "./validatorFactory.js";

export const settings = {
  parent: "project",
  name: "frontend",
  embedded: true,
  privacy: "private",
  updateableRefs: ["tech", "page", "component"],
  deleteType: "hard",
  overviewSel: "name",
  overviewPop: [],
  fullSel: "-__v -createdAt -createdBy",
  fullPop: [],
};

const frontendSchema = mongoose.Schema({
  techList: factory.validReference(settings.name, "tech", false, true, true),

  componentList: factory.validReference(
    settings.name,
    "component",
    false,
    true,
    true,
  ),

  pageList: factory.validReference(settings.name, "page", false, true, true),

  project: factory.validReference(
    settings.name,
    settings.parent,
    true,
    false,
    false,
  ),

  createdBy: factory.validReference(settings.name, "user"),

  createdAt: {
    type: Date,
  },
});

frontendSchema.staticSettings = settings;

frontendSchema.pre("save", async function (next) {
  this.createdAt = new Date();
  next();
});

frontendSchema.post("findOneAndDelete", async function (frontend) {
  await relationships.afterDeleteOne(frontend);
});

frontendSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany(this);
});

frontendSchema.post("save", async function (frontend) {
  await relationships.afterAddOne(frontend);
});

export default frontendSchema;

/*

NOTE: Add the following to modelRegistry.js:

  import frontendSchema from "./frontendSchema.js"
  
  Frontend: mongoose.model("Frontend", frontendSchema),

NOTE: And don't forget to add me to any DELETE logic in projectSchema.js

*/
