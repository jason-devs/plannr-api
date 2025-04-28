import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const apiKeySchema = mongoose.Schema({
  identifier: {
    type: String,
    unique: true,
  },
  key: {
    type: String,
    unique: true,
  },
});

apiKeySchema.pre("save", async function (next) {
  if (!this.isModified("key")) return next();
  this.key = await bcrypt.hash(this.key, 12);
  next();
});

apiKeySchema.methods.checkApiKey = async function (candidate, saved) {
  return await bcrypt.compare(candidate, saved);
};

const ApiKey = mongoose.model("ApiKey", apiKeySchema);

export default ApiKey;
