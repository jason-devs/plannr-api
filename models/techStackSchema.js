import mongoose from "mongoose";
import slugify from "slugify";
import * as factory from "./validatorFactory.js";
import * as relationships from "./relationships.js";

const settings = {
  name: "tech stack",
  parent: "project",
  isPrivate: true,
};

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

  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
  },
});

techStackSchema.staticSettings = settings;

techStackSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.createdAt = new Date();
  next();
});

techStackSchema.post("findOneAndDelete", async function (techStack) {
  await relationships.afterDeleteOne(techStack);
});

techStackSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany(this);
});

techStackSchema.post("save", async function (techStack) {
  await relationships.afterAddOne(techStack);
});

export default techStackSchema;
