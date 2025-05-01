import mongoose from "mongoose";
import slugify from "slugify";
import * as factory from "./validatorFactory.js";
import * as relationships from "./relationships.js";

const backendResourceSchema = mongoose.Schema({
  name: {
    type: String,
  },

  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
    validate: {
      validator: id => factory.validReference(mongoose.model("Project"), id),
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

backendResourceSchema.post(
  "findOneAndDelete",
  async function (backendResource) {
    await relationships.afterDeleteOne(
      backendResource,
      "project",
      "backend resource",
    );
  },
);

backendResourceSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany("project", "backend resource", this);
});

backendResourceSchema.post("save", async function (backendResource) {
  await relationships.afterAddOne(
    backendResource,
    "project",
    "backend resource",
  );
});

export default backendResourceSchema;
