import mongoose from "mongoose";
import slugify from "slugify";
import * as factory from "./validatorFactory.js";

const settings = { name: "role", parent: "none", isPrivate: false };

const roleSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `),

  description: factory.validText(settings, "small", true),

  custom: {
    type: Boolean,
  },

  createdBy: factory.validReference(settings.name, "user"),

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
