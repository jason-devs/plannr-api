import mongoose from "mongoose";
import * as relationships from "./relationships.js";
import * as factory from "./validatorFactory.js";

export const settings = {
  parent: "project",
  name: "data model",
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
}

const dataModelSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `, true),

  project: factory.validReference(settings.name, settings.parent),

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

dataModelSchema.post("findOneAndDelete", async function (dataModel) {
  await relationships.afterDeleteOne(dataModel);
});

dataModelSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany(this);
});

dataModelSchema.post("save", async function (dataModel) {
  await relationships.afterAddOne(dataModel);
});

export default dataModelSchema;

/*

NOTE: Add the following to modelRegistry.js:

  import dataModelSchema from "./dataModelSchema.js"
  
  DataModel: mongoose.model("DataModel", dataModelSchema),

NOTE: And don't forget to add me to any DELETE logic in projectSchema.js

*/
