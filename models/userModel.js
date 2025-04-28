import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please give us your name!"],
  },

  email: {
    type: String,
    validate: [validator.isEmail, "Please enter a valid email address!"],
    required: [true, "Please give us your email!"],
    unique: true,
  },

  password: {
    type: String,
    minlength: 8,
    required: [true, "Please enter a password!"],
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password!"],
    validate: {
      validator: function () {
        return this.password === this.passwordConfirm;
      },
      message: "Passwords do not match. Please check and try again!",
    },
  },

  createdAt: {
    type: Date,
  },

  role: {
    type: String,
    default: "user",
    select: false,
    enum: {
      message: "Role can only be of type user, or admin",
      values: ["user", "admin"],
    },
  },

  changedPasswordAt: {
    type: Date,
  },

  active: {
    default: true,
    type: Boolean,
    select: false,
  },

  passwordResetToken: String,

  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  this.createdAt = Date.now();
  next();
});

userSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

userSchema.methods.changedPasswordAfter = function (timestamp) {
  if (!this.changedPasswordAt) return false;
  return timestamp < this.changedPasswordAt.getTime() / 1000;
};

userSchema.methods.checkPassword = async function (candidate, saved) {
  return await bcrypt.compare(candidate, saved);
};

userSchema.methods.updateTokenExpired = function (currentTimestamp) {
  if (!this.passwordResetToken || !this.passwordResetExpires) return false;
  return currentTimestamp > this.passwordResetExpires.getTime();
};

userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
