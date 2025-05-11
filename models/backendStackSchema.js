import mongoose from "mongoose";
import * as factory from "./validatorFactory.js";
import Settings from "./Settings.js";

export const settings = new Settings({
  name: "backend stack",
  overviewSel: "techList",
  overviewPop: [
    {
      path: "techList",
      select: "name",
    },
  ],
});

const backendStackSchema = mongoose.Schema({
  //NOTE: References:

  techList: factory.validReference(settings.name, "tech", false, true, true),

  project: factory.validReference(settings.name, "project", true, false, false),

  //NOTE: Operational:

  createdBy: factory.validReference(settings.name, "user"),

  createdAt: {
    type: Date,
  },
});

backendStackSchema.staticSettings = settings;

backendStackSchema.pre("save", async function (next) {
  this.createdAt = new Date();
  next();
});

export default backendStackSchema;

/*

NOTE: Add the following to modelRegistry.js:

  import backendStackSchema from "./backendStackSchema.js"
  
  BackendStack: mongoose.model("BackendStack", backendStackSchema),

*/
