import mongoose from "mongoose";
import slugify from "slugify";
import * as relationships from "./relationships.js";
import * as factory from "./validatorFactory.js";

const settings = {
  name: "page",
  parent: "project",
  subDoc: "frontend",
  privacy: "private",
  deleteType: "hard",
  overviewSel: "name",
  overviewPop: [
    {
      path: "userStoryList",
      select: "fullStory",
    },
  ],
  fullSel: "-__v -createdAt -createdBy",
  fullPop: [
    {
      path: "userStoryList",
      select: "fullStory story role",
      populate: "role",
    },
  ],
};

const pageSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `),

  afterLogIn: {
    type: Boolean,
    default: false,
  },

  designImageMobile: {
    type: String,
  },

  designImageTablet: {
    type: String,
  },

  designImageDesktop: {
    type: String,
  },

  description: {
    type: String,
  },

  apiEndpoints: {
    type: [String],
  },

  navVisible: {
    type: Boolean,
    default: true,
  },

  dataModelList: factory.validReference(
    settings.name,
    "data model",
    false,
    true,
    true,
  ),

  userStoryList: factory.validReference(
    settings.name,
    "user story",
    false,
    true,
    true,
  ),

  sectionList: factory.validReference(
    settings.name,
    "section",
    false,
    true,
    true,
  ),

  project: factory.validReference(settings.name, settings.parent),

  createdBy: factory.validReference(settings.name, "user"),

  createdAt: {
    type: Date,
  },
});

pageSchema.staticSettings = settings;

pageSchema.virtual("roles").get(function () {
  const stories = this.userStoryList;
  const roles = new Set(stories.map(story => story.role.name));
  return [...roles];
});

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
