import mongoose from "mongoose";
import slugify from "slugify";
import * as relationships from "./relationships.js";

const pageSchema = mongoose.Schema({
  name: {
    type: String,
  },

  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
  },

  createdAt: {
    type: Date,
  },
});

pageSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.createdAt = new Date();
  next();
});

pageSchema.post("findOneAndDelete", async function (page) {
  await relationships.afterDeleteOne(page, "project", "page");
});

pageSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany("project", "page", this);
});

pageSchema.post("save", async function (page) {
  await relationships.afterAddOne(page, "project", "page");
});

export default pageSchema;
