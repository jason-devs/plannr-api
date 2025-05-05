import mongoose from "mongoose";
import slugify from "slugify";
import * as relationships from "./relationships.js";
import * as factory from "./validatorFactory.js";

const settings = {
  name: "project",
  parent: "user",
  privacy: "private",
  children: ["backend resource", "page", "user story"],
  updateableRefs: ["tech"],
  deleteType: "hard",
  overviewSel: "name",
  overviewPop: [],
  fullSel: "-__v -createdAt -createdBy -slug",
  fullPop: [
    {
      path: "userStoryList",
      select: "story",
      populate: {
        path: "role",
        select: "name",
      },
    },
    {
      path: "pageList",
      select: "name",
    },
    {
      path: "backendResourceList",
      select: "name",
    },
    {
      path: "techList",
      select: "name field",
    },
  ],
};

const projectSchema = new mongoose.Schema(
  {
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

    slug: factory.validSlug(settings.name),

    createdBy: factory.validReference(settings.name, "user"),

    createdAt: {
      type: Date,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

projectSchema.staticSettings = settings;

projectSchema.virtual("roles").get(function () {
  const stories = this.userStoryList;
  const roles = new Set(stories.map(story => story.role.name));
  return [...roles];
});

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
