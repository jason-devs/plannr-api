import mongoose from "mongoose";
import slugify from "slugify";
import * as factory from "./validatorFactory.js";
import Settings from "./Settings.js";

const settings = new Settings({
  name: "project",
  overviewSel: "name description",
});

const projectSchema = new mongoose.Schema(
  {
    name: factory.validText(settings, "title", true, ` `),

    description: factory.validText(settings, "large", false),

    slug: factory.validSlug(settings.name),

    createdBy: factory.validReference(settings.name, "user"),

    createdAt: {
      type: Date,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

projectSchema.staticSettings = settings;

projectSchema.pre("save", async function (next) {
  await Promise.all(
    ["FrontendStack", "BackendStack"].map(model =>
      mongoose.model(model).create({ project: this._id }),
    ),
  );
  this.createdAt = new Date();
  this.slug = `PRO-${slugify(this.name, { lower: true })}-${this._id.toString().slice(-5)}`;
  next();
});

export default projectSchema;
