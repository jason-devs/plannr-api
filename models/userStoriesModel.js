/* eslint-disable import/no-cycle */
import mongoose from "mongoose";
import Project from "./projectModel.js";
import * as factory from "./validatorFactory.js";

const userStorySchema = mongoose.Schema({
  story: {
    type: String,
    required: [true, "We need some text to make your user story!"],
  },

  completed: {
    type: Boolean,
    default: false,
  },

  role: {
    type: String,
  },

  position: {
    type: Number,
  },

  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
    required: [true, "Your user story needs a project!"],
    validate: {
      validator: id => factory.validReference(Project, id),
      message: props => factory.validReferenceMessage("User Story", props),
    },
  },

  slug: {
    type: String,
  },

  createdAt: {
    type: Date,
  },
});

userStorySchema.pre("save", async function (next) {
  const userStories = await this.constructor.find({ project: this.project });
  this.position = userStories.length + 1;
  this.slug = `${this.role.toLowerCase()}-${this.position}`;
  this.createdAt = new Date();
  next();
});

userStorySchema.post("findOneAndDelete", async userStory => {
  await Project.findByIdAndUpdate(userStory.project, {
    $pull: { userStories: userStory._id },
  });
});

userStorySchema.post("deleteMany", async function () {
  await Project.findByIdAndUpdate(
    this.getQuery().project,
    { userStories: [] },
    { new: true },
  );
});

userStorySchema.post("save", async userStory => {
  await Project.findByIdAndUpdate(
    userStory.project,
    { $push: { userStories: userStory._id } },
    { new: true },
  );
});

const UserStory = mongoose.model("UserStory", userStorySchema);

export default UserStory;
