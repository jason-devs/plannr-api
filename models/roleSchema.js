import mongoose from "mongoose";
import slugify from "slugify";

const settings = { name: "role", parent: "none", isPrivate: false };

const roleSchema = mongoose.Schema({
  name: {
    type: String,
  },

  description: {
    type: String,
  },

  custom: {
    type: Boolean,
  },

  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
  },
});

roleSchema.staticSettings = settings;

roleSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.createdAt = new Date();
  next();
});

export default roleSchema;
