import mongoose from "mongoose";
import slugify from "slugify";
import * as factory from "./validatorFactory.js";

const settings = {
  name: "tech",
  parent: "none",
  isPrivate: false,
};

const techSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `, true),

  createdBy: factory.validReference(settings.name, "user"),

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

export default techSchema;
