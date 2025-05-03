import mongoose from "mongoose";
import slugify from "slugify";
import * as factory from "./validatorFactory.js";
import * as relationships from "./relationships.js";

const settings = {
  name: "tech stack",
  parent: "project",
  isPrivate: true,
};

const techStackSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `, true),

  project: factory.validReference(settings.name, settings.parent),

  techList: factory.validReference(settings.name, "tech", false, true, true),

  createdBy: factory.validReference(settings.name, "user"),

  slug: factory.validSlug(settings.name),

  createdAt: {
    type: Date,
  },
});

techStackSchema.staticSettings = settings;

techStackSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.createdAt = new Date();
  next();
});

techStackSchema.post("findOneAndDelete", async function (techStack) {
  await relationships.afterDeleteOne(techStack);
});

techStackSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany(this);
});

techStackSchema.post("save", async function (techStack) {
  await relationships.afterAddOne(techStack);
});

export default techStackSchema;
