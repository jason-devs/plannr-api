import mongoose from "mongoose";
import slugify from "slugify";
import * as relationships from "./relationships.js";

const customRoleSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "We cannot create a new custom role without a name."],
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

customRoleSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.createdAt = new Date();
  next();
});

customRoleSchema.post("findOneAndDelete", async function (customRole) {
  await relationships.afterDeleteOne(customRole, "project", "custom role");
});

customRoleSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany("project", "custom role", this);
});

customRoleSchema.post("save", async function (customRole) {
  await relationships.afterAddOne(customRole, "project", "custom role");
});

export default customRoleSchema;
