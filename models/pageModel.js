import mongoose from "mongoose";
import slugify from "slugify";
import Project from "./projectModel.js";

const pageSchema = mongoose.Schema({
  name: {
    type: String,
  },

  slug: {
    type: String,
  },

  position: {
    type: Number,
  },

  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
  },

  createdAt: {
    type: Date,
  },
});

pageSchema.pre("save", async function (next) {
  const pages = await this.constructor.find({ project: this.project });
  this.position = pages.length + 1;
  this.slug = slugify(this.name, { lower: true });
  this.createdAt = new Date();
  next();
});

pageSchema.post("findOneAndDelete", async page => {
  await Project.findByIdAndUpdate(page.project, {
    $pull: { pages: page._id },
  });
});

pageSchema.post("deleteMany", async function () {
  await Project.findByIdAndUpdate(
    this.getQuery().project,
    { pages: [] },
    { new: true },
  );
});

pageSchema.post("save", async page => {
  await Project.findByIdAndUpdate(
    page.project,
    { $push: { pages: page._id } },
    { new: true },
  );
});

const Page = mongoose.model("Page", pageSchema);

export default Page;
