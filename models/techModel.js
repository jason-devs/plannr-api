import mongoose from "mongoose";
import slugify from "slugify";
import TechStack from "./techStackModel.js";
import * as factory from "./validatorFactory.js";

const techSchema = mongoose.Schema({
  name: {
    type: String,
  },

  techStack: {
    type: mongoose.Schema.ObjectId,
    ref: "TechStack",
    validate: {
      validator: id => factory.validReference(TechStack, id),
      message: props => factory.validReferenceMessage("Tech", props),
    },
  },

  createdAt: {
    type: Date,
  },
});

techSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.createdAt = new Date();
  next();
});

techSchema.post("findOneAndDelete", async tech => {
  await TechStack.findByIdAndUpdate(tech.techStack, {
    $pull: { techs: tech._id },
  });
});

techSchema.post("deleteMany", async function () {
  await TechStack.findByIdAndUpdate(
    this.getQuery().techStack,
    { techs: [] },
    { new: true },
  );
});

techSchema.post("save", async tech => {
  await TechStack.findByIdAndUpdate(
    tech.techStack,
    { $push: { techs: tech._id } },
    { new: true },
  );
});

const Tech = mongoose.model("Tech", techSchema);

export default Tech;
