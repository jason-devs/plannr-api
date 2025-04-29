/* eslint-disable import/no-cycle */
import mongoose from "mongoose";
import slugify from "slugify";
import User from "./userModel.js";
import UserStory from "./userStoriesModel.js";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "We need a name to create your project!"],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },

  userStories: {
    type: [mongoose.Schema.ObjectId],
    ref: "UserStory",
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

projectSchema.post("save", async project => {
  await User.findByIdAndUpdate(
    project.user,
    { $push: { projects: project._id } },
    { new: true },
  );
});

projectSchema.post("findOneAndDelete", async project => {
  await UserStory.deleteMany({
    _id: { $in: project.userStories },
  });
  await User.findByIdAndUpdate(project.user, {
    $pull: { projects: project._id },
  });
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
