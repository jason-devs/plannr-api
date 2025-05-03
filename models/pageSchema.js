import mongoose from "mongoose";
import slugify from "slugify";
import * as relationships from "./relationships.js";

const settings = {
  name: "page",
  parent: "project",
  isPrivate: true,
};

const pageSchema = mongoose.Schema({
  name: {
    type: String,
  },

  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
  },

  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
  },
});

pageSchema.staticSettings = settings;

pageSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.createdAt = new Date();
  next();
});

pageSchema.post("findOneAndDelete", async function (page) {
  await relationships.afterDeleteOne(page);
});

pageSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany(this);
});

pageSchema.post("save", async function (page) {
  await relationships.afterAddOne(page);
});

export default pageSchema;
