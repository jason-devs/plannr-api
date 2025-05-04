import mongoose from "mongoose";
import slugify from "slugify";
import * as factory from "./validatorFactory.js";
import * as relationships from "./relationships.js";

const settings = {
  name: "backend resource",
  parent: "project",
  isPrivate: true,
  deleteType: "hard",
  checkCustom: false,
};

const backendResourceSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `),

  project: factory.validReference(settings.name, settings.parent),

  createdBy: factory.validReference(settings.name, "user"),

  createdAt: {
    type: Date,
  },
});

backendResourceSchema.staticSettings = settings;

backendResourceSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.createdAt = new Date();
  next();
});

backendResourceSchema.post(
  "findOneAndDelete",
  async function (backendResource) {
    await relationships.afterDeleteOne(backendResource);
  },
);

backendResourceSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany(this);
});

backendResourceSchema.post("save", async function (backendResource) {
  await relationships.afterAddOne(backendResource);
});

export default backendResourceSchema;
