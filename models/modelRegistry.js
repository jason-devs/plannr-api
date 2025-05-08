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
import dataModelSchema from "./dataModelSchema.js";
import sectionSchema from "./sectionSchema.js";
import pageComponentSchema from "./pageComponentSchema.js";
import frontendResourceSchema from "./frontendResourceSchema.js";
import frontendStackSchema from "./frontendStackSchema.js";
import componentSectionSchema from "./componentSectionSchema.js";

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
  DataModel: mongoose.model("DataModel", dataModelSchema),
  Section: mongoose.model("Section", sectionSchema),
  PageComponent: mongoose.model("PageComponent", pageComponentSchema),
  FrontendResource: mongoose.model("FrontendResource", frontendResourceSchema),
  FrontendStack: mongoose.model("FrontendStack", frontendStackSchema),
  ComponentSection: mongoose.model("ComponentSection", componentSectionSchema),
};

export default models;
