import mongoose from "mongoose";
import slugify from "slugify";
import * as relationships from "./relationships.js";

const roleSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "We cannot create a new role without a name."],
    unique: true,
  },

  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
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

roleSchema.post("findOneAndDelete", async function (role) {
  await relationships.afterDeleteOne(role, "project", "role");
});

roleSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany("project", "role", this);
});

roleSchema.post("save", async function (role) {
  await relationships.afterAddOne(role, "project", "role");
});

export default roleSchema;
