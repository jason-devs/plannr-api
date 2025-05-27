import mongoose from "mongoose";
import slugify from "slugify";
import * as factory from "./validatorFactory.js";
import { VALIDTECHFIELDS } from "../utils/config.js";
import Settings from "./Settings.js";

const settings = new Settings({
  name: "tech",
  privacy: "custom",
  deleteType: "soft",
  overviewSel: "-__v -createdAt -createdBy",
  overviewPop: [],
  fullSel: "-__v -createdAt -createdBy",
  fullPop: [],
});

const techSchema = mongoose.Schema({
  name: factory.validText(settings, "title", true, ` ./`, true),

  description: factory.validText(settings, "small", true),

  field: factory.validEnum(settings.name, VALIDTECHFIELDS),

  pros: {
    type: [String],
  },

  cons: {
    type: [String],
  },

  icon: {
    type: String,
  },

  openSource: {
    type: Boolean,
  },

  active: {
    type: Boolean,
    default: true,
  },

  custom: {
    type: Boolean,
    default: true,
  },

  released: {
    type: Date,
  },

  currentVersion: {
    type: String,
  },

  stability: factory.validEnum(settings.name, [
    "Experimental",
    "Stable",
    "Deprecated",
    "Legacy",
  ]),

  github: {
    stars: Number,
    forks: Number,
    lastCommit: Date,
    openIssues: Number,
  },

  license: {
    type: factory.validEnum("License", [
      "MIT",
      "Apache-2.0",
      "GPL",
      "Proprietary",
    ]),
    cost: factory.validEnum("license", ["Free", "Freemium", "Paid"]),
  },

  learningCurve: factory.validEnum(settings.name, [
    "Beginner",
    "Intermediate",
    "Advanced",
  ]),

  //NOTE: Operational:

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
