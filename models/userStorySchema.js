import mongoose from "mongoose";
import validator from "validator";
import * as factory from "./validatorFactory.js";

const settings = {
  name: "user story",
  parent: "project",
  isPrivate: true,
};

const userStorySchema = mongoose.Schema({
  story: {
    type: String,
    required: [true, "We need some text to make your user story!"],
    maxLength: [
      250,
      `Sorry, that story is too long. Try shortening it, or breaking it into multiple stories. Max length is {MAXLENGTH} characters.`,
    ],
    validate: {
      validator: story =>
        validator.isAlphanumeric(story, "en-US", { ignore: `.,- !?"'/@%` }),
      message: `Apologies, user stories can only contain alphanumeric characters and the following special characters: ". , - ! ? " ' / @ %"`,
    },
  },

  completed: {
    type: Boolean,
    default: false,
  },

  role: {
    type: mongoose.Schema.ObjectId,
    ref: "Role",
  },

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

  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
    required: [true, "Your user story needs a project!"],
    validate: {
      validator: id => factory.validReference(mongoose.model("Project"), id),
      message: props => factory.validReferenceMessage("User Story", props),
    },
  },

  slug: {
    type: String,
    unique: [
      true,
      "Apologies, the auto generated slug for this user story was not unique in the database. Please try again.",
    ],
  },

  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
  },
});

userStorySchema.staticSettings = settings;

userStorySchema.pre("save", async function (next) {
  const userStories = await this.constructor.find({ project: this.project });
  this.position = userStories.length + 1;
  const role = await mongoose.model("Role").findById(this.role);
  this.story = this.story.replace("%%ROLE%%", role.name);
  this.createdAt = new Date();
  this.slug = `user-story-${this._id.toString().slice(-5).toUpperCase()}${String(Date.now()).slice(-3)}`;
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
