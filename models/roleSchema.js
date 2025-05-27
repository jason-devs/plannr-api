import mongoose from "mongoose";
import slugify from "slugify";
import * as factory from "./validatorFactory.js";
import Settings from "./Settings.js";

const settings = new Settings({
  name: "role",
  privacy: "custom",
  deleteType: "soft",
  overviewSel: "name description",
});

const roleSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` `),

  description: factory.validText(settings, "small", true),

  //NOTE: Operational:

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
