import mongoose from "mongoose";
import User from "./userModel.js";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "We need a name to create your project!"],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

projectSchema.post("save", async project => {
  await User.findByIdAndUpdate(
    project.user,
    { $push: { projects: project._id } },
    { new: true },
  );
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
