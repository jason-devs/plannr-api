import mongoose from "mongoose";
import slugify from "slugify";
import Project from "./projectModel.js";
import * as factory from "./validatorFactory.js";

const backendResourceSchema = mongoose.Schema({
  name: {
    type: String,
  },

  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
    validate: {
      validator: id => factory.validReference(Project, id),
      message: props =>
        factory.validReferenceMessage("Backend Resource", props),
    },
  },

  createdAt: {
    type: Date,
  },
});

backendResourceSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.createdAt = new Date();
  next();
});

backendResourceSchema.post("findOneAndDelete", async backendResource => {
  await Project.findByIdAndUpdate(backendResource.project, {
    $pull: { backendResources: backendResource._id },
  });
});

backendResourceSchema.post("deleteMany", async function () {
  await Project.findByIdAndUpdate(
    this.getQuery().project,
    { backendResources: [] },
    { new: true },
  );
});

backendResourceSchema.post("save", async backendResource => {
  await Project.findByIdAndUpdate(
    backendResource.project,
    { $push: { backendResources: backendResource._id } },
    { new: true },
  );
});

const BackendResource = mongoose.model(
  "BackendResource",
  backendResourceSchema,
);

export default BackendResource;
