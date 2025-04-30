/* eslint-disable import/no-cycle */
import mongoose from "mongoose";
import slugify from "slugify";
import User from "./userModel.js";
import UserStory from "./userStoriesModel.js";
import * as factory from "./validatorFactory.js";
import Page from "./pageModel.js";
import BackendResource from "./backendResourceModel.js";
import TechStack from "./techStackModel.js";
import Role from "./roleModel.js";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "We need a name to create your project!"],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    validate: {
      validator: id => factory.validReference(User, id),
      message: props => factory.validReferenceMessage("Project", props),
    },
  },

  userStories: {
    type: [mongoose.Schema.ObjectId],
    ref: "UserStory",
  },

  pages: {
    type: [mongoose.Schema.ObjectId],
    ref: "Page",
  },

  backendResources: {
    type: [mongoose.Schema.ObjectId],
    ref: "BackendResource",
  },

  techStack: {
    type: mongoose.Schema.ObjectId,
    ref: "TechStack",
  },

  roles: {
    type: [mongoose.Schema.ObjectId],
    ref: "Role",
    validate: {
      validator: id => factory.validReference(Role, id),
      message: props => factory.validReferenceMessage("Project", props),
    },
  },

  slug: {
    type: String,
  },

  createdAt: {
    type: Date,
  },
});

projectSchema.methods.cleanupRoles = async function (roleId) {
  // if (this.roles.includes(roleId) || roleId === undefined) return;
  this.roles.push(roleId);
  // await this.save({ validateBeforeSave: true });
};

projectSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

projectSchema.post("save", async project => {
  await User.findByIdAndUpdate(
    project.user,
    { $push: { projects: project._id } },
    { new: true },
  );
});

projectSchema.post("findOneAndDelete", async project => {
  if (project.techStack) await TechStack.findByIdAndDelete(project.techStack);
  await Role.deleteMany({
    _id: { $in: project.roles },
  });
  await BackendResource.deleteMany({
    _id: { $in: project.backendResources },
  });
  await Page.deleteMany({
    _id: { $in: project.pages },
  });
  await UserStory.deleteMany({
    _id: { $in: project.userStories },
  });
  await User.findByIdAndUpdate(project.user, {
    $pull: { projects: project._id },
  });
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
