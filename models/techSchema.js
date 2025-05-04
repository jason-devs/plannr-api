import mongoose from "mongoose";
import slugify from "slugify";
import * as factory from "./validatorFactory.js";

const settings = {
  name: "tech",
  parent: "none",
  isPrivate: false,
  deleteType: "soft",
  checkCustom: true,
};

const techSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `, true),

  active: {
    type: Boolean,
    default: true,
  },

  custom: {
    type: Boolean,
    default: true,
  },

  createdBy: factory.validReference(settings.name, "user"),

  createdAt: {
    type: Date,
  },
});

techSchema.staticSettings = settings;

techSchema.query.active = function () {
  return this.where({ active: true });
};

techSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.createdAt = new Date();
  next();
});

export default techSchema;
