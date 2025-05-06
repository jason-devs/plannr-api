import mongoose from "mongoose";
import * as relationships from "./relationships.js";
import * as factory from "./validatorFactory.js";

export const settings = {
  parent: "project",
  name: "relationship",
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

const relationshipSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `, true),

  project: factory.validReference(settings.name, settings.parent),

  createdBy: factory.validReference(settings.name, "user"),

  createdAt: {
    type: Date,
  },
});

relationshipSchema.staticSettings = settings;

relationshipSchema.pre("save", async function (next) {
  this.createdAt = new Date();
  next();
});

relationshipSchema.post("findOneAndDelete", async function (relationship) {
  await relationships.afterDeleteOne(relationship);
});

relationshipSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany(this);
});

relationshipSchema.post("save", async function (relationship) {
  await relationships.afterAddOne(relationship);
});

export default relationshipSchema;

/*

NOTE: Add the following to modelRegistry.js:

  import relationshipSchema from "./relationshipSchema.js"
  
  Relationship: mongoose.model("Relationship", relationshipSchema),

NOTE: And don't forget to add me to any DELETE logic in projectSchema.js

*/
