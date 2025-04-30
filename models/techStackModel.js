/* eslint-disable import/no-cycle */
import mongoose from "mongoose";
import slugify from "slugify";
import Project from "./projectModel.js";
import Tech from "./techModel.js";
import * as factory from "./validatorFactory.js";

const techStackSchema = mongoose.Schema({
  name: {
    type: String,
  },

  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
    validate: {
      validator: id => factory.validReference(Project, id),
      message: props => factory.validReferenceMessage("Tech-Stack", props),
    },
  },

  techs: {
    type: [mongoose.Schema.ObjectId],
    ref: "Tech",
    validate: {
      validator: id => factory.validReference(Tech, id),
      message: props => factory.validReferenceMessage("Tech", props),
    },
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

techStackSchema.post("findOneAndDelete", async techStack => {
  await Project.findByIdAndUpdate(techStack.project, { techStack: undefined });
});

techStackSchema.post("save", async techStack => {
  await Project.findByIdAndUpdate(
    techStack.project,
    { techStack: techStack._id },
    { new: true },
  );
});

const TechStack = mongoose.model("TechStack", techStackSchema);

export default TechStack;
