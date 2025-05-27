import mongoose from "mongoose";
// import * as factory from "./validatorFactory.js";
import Settings from "./Settings.js";

export const settings = new Settings({
  name: "backend stack",
  overviewSel: "techList project",
  overviewPop: [
    {
      path: "techList",
      select: "name",
    },
  ],
});

const backendStackSchema = mongoose.Schema({
  //NOTE: References:

  techList: {
    type: [mongoose.Schema.ObjectId],
    ref: "Tech",
  },

  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
  },

  //NOTE: Operational:

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
