import mongoose from "mongoose";
import slugify from "slugify";
import * as factory from "./validatorFactory.js";
import * as relationships from "./relationships.js";

const techStackSchema = mongoose.Schema({
  name: {
    type: String,
  },

  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
    validate: {
      validator: id => factory.validReference(mongoose.model("Project"), id),
      message: props => factory.validReferenceMessage("Tech-Stack", props),
    },
  },

  techList: {
    type: [mongoose.Schema.ObjectId],
    ref: "Tech",
  },

  createdAt: {
    type: Date,
  },
});

techStackSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.createdAt = new Date();
  next();
});

techStackSchema.post("findOneAndDelete", async function (techStack) {
  await relationships.afterDeleteOne(techStack, "project", "tech stack");
});

techStackSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany("project", "tech stack", this);
});

techStackSchema.post("save", async function (techStack) {
  await relationships.afterAddOne(techStack, "project", "tech stack");
});

export default techStackSchema;
