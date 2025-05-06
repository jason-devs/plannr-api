import mongoose from "mongoose";
import * as relationships from "./relationships.js";
import * as factory from "./validatorFactory.js";

export const settings = {
  parent: "project",
  name: "backend",
  privacy: "private",
  embedded: true,
  updateableRefs: ["tech", "data model", "backend resource"],
  deleteType: "hard",
  overviewSel: "name",
  overviewPop: [],
  fullSel: "-__v -createdAt -createdBy",
  fullPop: [],
};

const backendSchema = mongoose.Schema({
  backendResourceList: factory.validReference(
    settings.name,
    "backend resource",
    false,
    true,
    true,
  ),

  dataModelList: factory.validReference(
    settings.name,
    "data model",
    false,
    true,
    true,
  ),

  techList: factory.validReference(settings.name, "tech", false, true, true),

  createdBy: factory.validReference(settings.name, "user"),

  createdAt: {
    type: Date,
  },
});

backendSchema.staticSettings = settings;

backendSchema.pre("save", async function (next) {
  this.createdAt = new Date();
  next();
});

backendSchema.post("findOneAndDelete", async function (backend) {
  await relationships.afterDeleteOne(backend);
});

backendSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany(this);
});

backendSchema.post("save", async function (backend) {
  await relationships.afterAddOne(backend);
});

export default backendSchema;

/*

NOTE: Add the following to modelRegistry.js:

  import backendSchema from "./backendSchema.js"
  
  Backend: mongoose.model("Backend", backendSchema),

NOTE: And don't forget to add me to any DELETE logic in projectSchema.js

*/
