import mongoose from "mongoose";
import * as factory from "./validatorFactory.js";
import Settings from "./Settings.js";

const settings = new Settings({
  name: "user story",
  privacy: "private",
  overviewSel: "story fullStory",
  overviewPop: [
    {
      path: "role",
      select: "name description",
    },
  ],
});

const userStorySchema = mongoose.Schema(
  {
    story: factory.validText(settings, "small", true),

    completed: {
      type: Boolean,
      default: false,
    },

    priority: factory.validEnum(settings.name, ["core", "extra"], 0, true),

    //NOTE: References:

    role: factory.validReference(settings.name, "role", false, false),

    page: factory.validReference(settings.name, "page", false, false, true),

    //NOTE: Operational:

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
  if (!this.role) return `As a -- -- I want to ${this.story}`;
  return `As ${this.role.name?.toLowerCase() === "admin" ? "an" : "a"} ${this.role.name?.toLowerCase()} I want to ${this.story[0].toLowerCase() + this.story.slice(1)}`;
});

userStorySchema.pre("save", async function (next) {
  this.createdAt = new Date();

  next();
});

export default userStorySchema;
