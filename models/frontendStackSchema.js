import mongoose from "mongoose";
// import * as factory from "./validatorFactory.js";
import Settings from "./Settings.js";

export const settings = new Settings({
  name: "frontend stack",
  overviewSel: "techList",
  overviewPop: [
    {
      path: "techList",
      select: "name",
    },
  ],
  fullSel: "techList",
  fullPop: {
    path: "techList",
    select: "name",
  },
});

const frontendStackSchema = mongoose.Schema({
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

frontendStackSchema.staticSettings = settings;

frontendStackSchema.pre("save", async function (next) {
  this.createdAt = new Date();
  next();
});

export default frontendStackSchema;

/*

NOTE: Add the following to modelRegistry.js:

  import frontendStackSchema from "./frontendStackSchema.js"
  
  FrontendStack: mongoose.model("FrontendStack", frontendStackSchema),

*/
