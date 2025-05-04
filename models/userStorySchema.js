import mongoose from "mongoose";
import * as factory from "./validatorFactory.js";

const settings = {
  name: "user story",
  parent: "project",
  isPrivate: true,
  deleteType: "hard",
  checkCustom: false,
  overviewSel: "story position completed",
  overviewPop: [],
  fullSel: "-__v -createdAt -slug -createdBy",
  fullPop: [
    {
      path: "project",
      select: "name",
    },
    {
      path: "role",
      select: "name description",
    },
  ],
};

const userStorySchema = mongoose.Schema({
  story: factory.validText(settings, true),

  completed: {
    type: Boolean,
    default: false,
  },

  role: factory.validReference(settings.name, "role"),

  priority: factory.validEnum(settings.name, ["core", "extra"], 0, true),

  position: {
    type: Number,
  },

  project: factory.validReference(settings.name, settings.parent),

  slug: factory.validSlug(settings.name),

  createdBy: factory.validReference(settings.name, "user"),

  createdAt: {
    type: Date,
  },
});

userStorySchema.staticSettings = settings;

userStorySchema.pre("save", async function (next) {
  const [storiesCount, role] = await Promise.all([
    this.constructor.countDocuments({ project: this.project }),
    mongoose.model("Role").findById(this.role, { name: 1 }),
  ]);

  this.position = storiesCount + 1;
  this.story = this.story.replace("((ROLE))", role.name);
  this.createdAt = new Date();
  this.slug = `US-${this._id.toString().slice(-5)}-${Date.now().toString(36)}`;

  next();
});

userStorySchema.post("findOneAndDelete", async userStory => {
  const roleCount = await userStory.constructor.countDocuments({
    role: userStory.role,
  });
  let query = { $pull: { userStoryList: userStory._id } };
  if (roleCount === 0) {
    query = {
      $pull: { userStoryList: userStory._id, roleList: userStory.role },
    };
  }
  await mongoose.model("Project").findByIdAndUpdate(userStory.project, query);
});

userStorySchema.post("deleteMany", async function () {
  await mongoose.model("Project").findByIdAndUpdate(this.getQuery().project, {
    userStoryList: [],
    roleList: [],
  });
});

userStorySchema.post("save", async userStory => {
  await mongoose.model("Project").findByIdAndUpdate(userStory.project, {
    $push: { userStoryList: userStory._id },
    $addToSet: { roleList: userStory.role },
  });
});

export default userStorySchema;
