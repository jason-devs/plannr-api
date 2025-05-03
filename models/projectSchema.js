import mongoose from "mongoose";
import slugify from "slugify";
import * as relationships from "./relationships.js";

const settings = {
  name: "project",
  parent: "user",
  isPrivate: true,
  children: ["tech stack", "backend resource", "page", "user story"],
};

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "We need a name to create your project!"],
  },

  userStoryList: {
    type: [mongoose.Schema.ObjectId],
    ref: "UserStory",
  },

  pageList: {
    type: [mongoose.Schema.ObjectId],
    ref: "Page",
  },

  backendResourceList: {
    type: [mongoose.Schema.ObjectId],
    ref: "BackendResource",
  },

  techStackList: {
    type: [mongoose.Schema.ObjectId],
    ref: "TechStack",
  },

  roleList: {
    type: [mongoose.Schema.ObjectId],
    ref: "Role",
  },

  slug: {
    type: String,
  },

  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },

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
