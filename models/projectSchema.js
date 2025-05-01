import mongoose from "mongoose";
import slugify from "slugify";
import * as factory from "./validatorFactory.js";
import * as relationships from "./relationships.js";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "We need a name to create your project!"],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    validate: {
      validator: id => factory.validReference(mongoose.model("User"), id),
      message: props => factory.validReferenceMessage("Project", props),
    },
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

  createdAt: {
    type: Date,
  },
});

projectSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

projectSchema.post("save", async function (project) {
  await relationships.afterAddOne(project, "user", "project");
});

projectSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany("user", "project", this);
});

projectSchema.post("findOneAndDelete", async function (project) {
  await relationships.deleteMultipleChildren(project, [
    "tech stack",
    "backend resource",
    "page",
    "user story",
  ]);
});

projectSchema.post("findOneAndDelete", async function (project) {
  await relationships.afterDeleteOne(project, "user", "project");
});

export default projectSchema;
