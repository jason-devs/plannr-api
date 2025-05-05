import mongoose from "mongoose";
import slugify from "slugify";
import * as factory from "./validatorFactory.js";

const settings = {
  name: "role",
  parent: "none",
  privacy: "custom",
  deleteType: "soft",
  overviewSel: "name",
  overviewPop: [],
  fullSel: "-__v -createdAt -createdBy",
  fullPop: [],
};

const roleSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `),

  description: factory.validText(settings, "small", true),

  custom: {
    type: Boolean,
    default: false,
  },

  active: {
    type: Boolean,
    default: true,
  },

  createdBy: factory.validReference(settings.name, "user"),

  createdAt: {
    type: Date,
  },
});

roleSchema.staticSettings = settings;

roleSchema.query.active = function () {
  return this.where({ active: true });
};

roleSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.createdAt = new Date();
  next();
});

export default roleSchema;
