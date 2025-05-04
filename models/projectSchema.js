import mongoose from "mongoose";
import slugify from "slugify";
import * as relationships from "./relationships.js";
import * as factory from "./validatorFactory.js";

const settings = {
  name: "project",
  parent: "user",
  isPrivate: true,
  children: ["backend resource", "page", "user story"],
  deleteType: "hard",
  checkCustom: false,
};

const projectSchema = new mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `),

  userStoryList: factory.validReference(
    settings.name,
    "user story",
    false,
    true,
    true,
  ),

  pageList: factory.validReference(settings.name, "page", false, true, true),

  backendResourceList: factory.validReference(
    settings.name,
    "backend resource",
    false,
    true,
    true,
  ),

  techList: factory.validReference(settings.name, "tech", false, true, true),

  roleList: factory.validReference(settings.name, "role", false, true, true),

  slug: factory.validSlug(settings.name),

  createdBy: factory.validReference(settings.name, "user"),

  createdAt: {
    type: Date,
  },
});

projectSchema.staticSettings = settings;

projectSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

projectSchema.post("save", async function (project) {
  await relationships.afterAddOne(project);
});

projectSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany(this);
});

projectSchema.post("findOneAndDelete", async function (project) {
  await relationships.afterDeleteOne(project);
  await relationships.deleteMultipleChildren(project);
});

export default projectSchema;
