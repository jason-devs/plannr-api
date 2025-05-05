import mongoose from "mongoose";
import slugify from "slugify";
import * as relationships from "./relationships.js";
import * as factory from "./validatorFactory.js";

const settings = {
  name: "page",
  parent: "project",
  privacy: "private",
  deleteType: "hard",
  overviewSel: "name",
  overviewPop: [],
  fullSel: "-__v -createdAt -createdBy",
  fullPop: [],
};

const pageSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `),

  project: factory.validReference(settings.name, settings.parent),

  createdBy: factory.validReference(settings.name, "user"),

  createdAt: {
    type: Date,
  },
});

pageSchema.staticSettings = settings;

pageSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.createdAt = new Date();
  next();
});

pageSchema.post("findOneAndDelete", async function (page) {
  await relationships.afterDeleteOne(page);
});

pageSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany(this);
});

pageSchema.post("save", async function (page) {
  await relationships.afterAddOne(page);
});

export default pageSchema;
