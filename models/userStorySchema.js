import mongoose from "mongoose";
import * as factory from "./validatorFactory.js";

const settings = {
  name: "user story",
  parent: "page",
  privacy: "private",
  deleteType: "hard",
  updateableRefs: ["role", "page"],
  overviewSel: "story position completed",
  overviewPop: [],
  fullSel: "-__v -createdAt -slug -createdBy",
  fullPop: [
    {
      path: "role",
      select: "name description",
    },
    {
      path: "page",
      select: "name",
    },
  ],
};

const userStorySchema = mongoose.Schema(
  {
    story: factory.validText(settings, true),

    completed: {
      type: Boolean,
      default: false,
    },

    role: factory.validReference(settings.name, "role", false, false),

    page: factory.validReference(
      settings.name,
      settings.parent,
      true,
      false,
      false,
    ),

    priority: factory.validEnum(settings.name, ["core", "extra"], 0, true),

    position: {
      type: Number,
    },

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

userStorySchema.staticSettings = settings;

userStorySchema.virtual("fullStory").get(function () {
  if (!this.role) return this.story.replace("((ROLE))", "-- --");
  return `As ${this.role.name === "admin" ? "an" : "a"} ${this.role.name} ${this.story}`;
});

userStorySchema.pre("save", async function (next) {
  const storiesCount = await this.constructor.countDocuments({
    project: this.project,
  });
  this.position = storiesCount + 1;
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
