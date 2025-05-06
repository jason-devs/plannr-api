import mongoose from "mongoose";
import slugify from "slugify";
import * as relationships from "./relationships.js";
import * as factory from "./validatorFactory.js";
import frontendSchema from "./frontendSchema.js";
import backendSchema from "./backendSchema.js";

const settings = {
  name: "project",
  parent: "user",
  privacy: "private",
  children: ["backend resource", "page", "user story"],
  updateableRefs: ["tech"],
  deleteType: "hard",
  overviewSel: "name",
  overviewPop: [],
  fullSel: "-__v -createdAt -createdBy -slug",
  fullPop: [],
};

const projectSchema = new mongoose.Schema(
  {
    name: factory.validText(settings, "title", true, ` `),

    description: factory.validText(settings, "large", false),

    frontend: frontendSchema,

    backend: backendSchema,

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

// projectSchema.virtual("roles").get(function () {
//   const stories = this.userStoryList;
//   const roles = new Set(stories.map(story => story.role.name));
//   return [...roles];
// });

projectSchema.pre("save", function (next) {
  if (!this.frontend) this.frontend = {};
  if (!this.backend) this.backend = {};
  this.slug = slugify(this.name, { lower: true });
  next();
});

projectSchema.post("save", async function (project) {
  await relationships.afterAddOne(project);
});

projectSchema.post("deleteMany", async function () {
  await relationships.afterDeleteMany(this);
});

projectSchema.post("findOneAndDelete", async function (project) {
  await relationships.afterDeleteOne(project);
  await relationships.deleteMultipleChildren(project);
});

export default projectSchema;
