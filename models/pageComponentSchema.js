import mongoose from "mongoose";
import * as factory from "./validatorFactory.js";
import Settings from "./Settings.js";

export const settings = new Settings({
  name: "page component",
  privacy: "private",
  deleteType: "hard",
});

const pageComponentSchema = mongoose.Schema({
  //NOTE: References:

  page: {
    type: mongoose.Schema.ObjectId,
    ref: "Page",
  },

  component: {
    type: mongoose.Schema.ObjectId,
    ref: "Component",
  },

  //NOTE: Operational:

  createdBy: factory.validReference(settings.name, "user"),

  createdAt: {
    type: Date,
  },
});

pageComponentSchema.staticSettings = settings;

pageComponentSchema.pre("save", async function (next) {
  this.createdAt = new Date();
  next();
});

export default pageComponentSchema;

/*

NOTE: Add the following to modelRegistry.js:

  import pageComponentSchema from "./pageComponentSchema.js"
  
  PageComponent: mongoose.model("PageComponent", pageComponentSchema),

NOTE: And don't forget to add me to any DELETE logic in noneSchema.js

*/
