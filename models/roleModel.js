import mongoose from "mongoose";
import slugify from "slugify";
import Project from "./projectModel.js";
import * as factory from "./validatorFactory.js";

const roleSchema = mongoose.Schema({
  name: {
    type: String,
  },

  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
    validate: {
      validator: id => factory.validReference(Project, id),
      message: props => factory.validReferenceMessage("Role", props),
    },
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
