import mongoose from "mongoose";
import projectSchema from "./projectSchema.js";
import userSchema from "./userSchema.js";
import userStorySchema from "./userStorySchema.js";
import roleSchema from "./roleSchema.js";
import backendResourceSchema from "./backendResourceSchema.js";
import techSchema from "./techSchema.js";
import apiKeySchema from "./apiKeySchema.js";
import pageSchema from "./pageSchema.js";
import componentSchema from "./componentSchema.js";

const models = {
  User: mongoose.model("User", userSchema),
  Project: mongoose.model("Project", projectSchema),
  UserStory: mongoose.model("UserStory", userStorySchema),
  Role: mongoose.model("Role", roleSchema),
  BackendResource: mongoose.model("BackendResource", backendResourceSchema),
  Tech: mongoose.model("Tech", techSchema),
  Page: mongoose.model("Page", pageSchema),
  ApiKey: mongoose.model("ApiKey", apiKeySchema),
  Component: mongoose.model("Component", componentSchema),
};

export default models;
