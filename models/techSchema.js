import mongoose from "mongoose";
import slugify from "slugify";
import * as relationships from "./relationships.js";

const techSchema = mongoose.Schema({
  name: {
    type: String,
  },

  techStack: {
    type: mongoose.Schema.ObjectId,
    ref: "TechStack",
  },

  createdAt: {
    type: Date,
  },
});

techSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.createdAt = new Date();
  next();
});

techSchema.post("findOneAndDelete", async function (tech) {
  await relationships.afterDeleteOne(tech, "tech stack", "tech");
});

techSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany("tech stack", "tech", this);
});

techSchema.post("save", async function (tech) {
  await relationships.afterAddOne(tech, "tech stack", "tech");
});

export default techSchema;
