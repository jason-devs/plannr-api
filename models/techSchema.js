import mongoose from "mongoose";
import slugify from "slugify";
import * as relationships from "./relationships.js";

const settings = {
  name: "tech",
  parent: "tech stack",
  isPrivate: false,
};

const techSchema = mongoose.Schema({
  name: {
    type: String,
  },

  techStack: {
    type: mongoose.Schema.ObjectId,
    ref: "TechStack",
  },

  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
  },
});

techSchema.staticSettings = settings;

techSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.createdAt = new Date();
  next();
});

techSchema.post("findOneAndDelete", async function (tech) {
  await relationships.afterDeleteOne(tech);
});

techSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany(this);
});

techSchema.post("save", async function (tech) {
  await relationships.afterAddOne(tech);
});

export default techSchema;
