import mongoose from "mongoose";
import slugify from "slugify";

const roleSchema = mongoose.Schema({
  name: {
    type: String,
  },

  createdAt: {
    type: Date,
  },
});

roleSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.createdAt = new Date();
  next();
});

export default roleSchema;
