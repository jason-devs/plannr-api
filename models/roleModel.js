/* eslint-disable import/no-cycle */
import mongoose from "mongoose";
import slugify from "slugify";
import Project from "./projectModel.js";

const roleSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "We cannot create a new role without a name."],
    unique: true,
  },

  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
  },

  createdAt: {
    type: Date,
  },
});

roleSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.createdAt = new Date();
  next();
});

roleSchema.post("findOneAndDelete", async role => {
  await Project.findByIdAndUpdate(role.project, {
    $pull: { roles: role._id },
  });
});

roleSchema.post("deleteMany", async function () {
  await Project.findByIdAndUpdate(
    this.getQuery().project,
    { roles: [] },
    { new: true },
  );
});

roleSchema.post("save", async role => {
  await Project.findByIdAndUpdate(
    role.project,
    { $push: { roles: role._id } },
    { new: true },
  );
});

const Role = mongoose.model("Role", roleSchema);

export default Role;
