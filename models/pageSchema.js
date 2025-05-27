import mongoose from "mongoose";
import * as factory from "./validatorFactory.js";
import Settings from "./Settings.js";

const settings = new Settings({
  name: "page",
  invalidUpdateKeys: "project",
  overviewSel: "name description userStoryList",
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
});

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

  //NOTE: References:

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

  project: factory.validReference(settings.name, "project"),

  //NOTE: Operational:

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
  this.createdAt = new Date();
  next();
});

export default pageSchema;
