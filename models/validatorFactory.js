import validator from "validator";
import mongoose from "mongoose";
import { LARGETEXTLIMIT, SMALLTEXTLIMIT, TITLELIMIT } from "../utils/config.js";
import { convertCase } from "../utils/helpers.js";

export const validSlug = name => ({
  type: String,
  unique: [
    true,
    `Apologies, the auto generated slug for this ${name} was not unique in the database. Please try again.`,
  ],
});

export const validReference = (
  name,
  refName,
  isRequired = true,
  isArray = false,
  skipNew = false,
) => {
  const required = isRequired
    ? [true, `Your ${name} needs a ${refName}!`]
    : false;

  const type = isArray ? [mongoose.Schema.ObjectId] : mongoose.Schema.ObjectId;

  return {
    type,
    ref: convertCase(refName, "pascal"),
    required,
    validate: {
      validator: function (id) {
        if (skipNew && this.isNew) return true;
        return mongoose
          .model(convertCase(refName, "pascal"))
          .exists({ _id: id });
      },
      message: `Couldn't add that ${refName} to this ${name}, because we couldn't match this ID: {VALUE}`,
    },
  };
};

export const validText = (
  settings,
  size = "small",
  isRequired = true,
  validChars = ` =@!-"'?&*().,/`,
  isUnique = false,
) => {
  let length;

  if (size === "small") length = SMALLTEXTLIMIT;
  if (size === "large") length = LARGETEXTLIMIT;
  if (size === "title") length = TITLELIMIT;

  const required = isRequired
    ? [true, `We need a "{PATH}" to make a ${settings.name}!`]
    : false;

  const unique = isUnique
    ? [
        true,
        `We already have a ${settings.name} with that ${size === "title" ? "title" : "text"}. They need to all be different.`,
      ]
    : false;

  return {
    type: String,
    required,
    unique,
    maxLength: [
      length,
      `Sorry, that text is too long. Try shortening it, or breaking it up. Max length for a {PATH} in a ${settings.name} is {MAXLENGTH} characters.`,
    ],
    validate: {
      validator: text =>
        validator.isAlphanumeric(text, "en-US", { ignore: validChars }),
      message: `Apologies, {PATH} in ${settings.name} can only contain alphanumeric characters and the following special characters: "${validChars.split("").join(" ")}"`,
    },
  };
};
