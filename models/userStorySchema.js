import mongoose from "mongoose";
import * as factory from "./validatorFactory.js";

const settings = {
  name: "user story",
  parent: "project",
  isPrivate: true,
  deleteType: "hard",
  checkCustom: false,
};

const userStorySchema = mongoose.Schema({
  story: factory.validText(settings, true),

  completed: {
    type: Boolean,
    default: false,
  },

  role: factory.validReference(settings.name, "role"),

  priority: {
    type: String,
    enum: {
      values: ["core", "extra"],
      message: `Priority must be either "core" or "extra", {VALUE} is not valid.`,
    },
    required: [
      true,
      `Apologies, we cannot save this user story without a priority. Choose between "core" or "extra".`,
    ],
    default: "core",
  },

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
  const roleCount = await userStory.constructor.find({ role: userStory.role });
  let query = { $pull: { userStories: userStory._id } };
  if (roleCount.length === 0) {
    query = {
      $pull: { userStories: userStory._id, roles: userStory.role },
    };
  }
  await mongoose.model("Project").findByIdAndUpdate(userStory.project, query);
});

userStorySchema.post("deleteMany", async function () {
  await mongoose.model("Project").findByIdAndUpdate(this.getQuery().project, {
    userStories: [],
    roles: [],
  });
});

userStorySchema.post("save", async userStory => {
  await mongoose.model("Project").findByIdAndUpdate(userStory.project, {
    $push: { userStoryList: userStory._id },
    $addToSet: { roleList: userStory.role },
  });
});

export default userStorySchema;
