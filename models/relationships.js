import mongoose from "mongoose";
import * as config from "../utils/config.js";
import { convertCase } from "../utils/helpers.js";

export const afterDeleteOne = async function (deletedDoc, parentRef, childRef) {
  await mongoose
    .model(convertCase(parentRef, "pascal"))
    .findByIdAndUpdate(deletedDoc[convertCase(parentRef, "camel")], {
      $pull: { [`${convertCase(childRef, "camel")}List`]: deletedDoc._id },
    });
};

export const afterDeleteMany = async function (parentRef, childRef, that) {
  await mongoose
    .model(convertCase(parentRef, "pascal"))
    .findByIdAndUpdate(that.getQuery()[convertCase(parentRef, "camel")], {
      [`${convertCase(childRef, "camel")}List`]: [],
    });
};

export const afterAddOne = async function (addedDoc, parentRef, childRef) {
  await mongoose
    .model(convertCase(parentRef, "pascal"))
    .findByIdAndUpdate(addedDoc[convertCase(parentRef, "camel")], {
      $push: { [`${convertCase(childRef, "camel")}List`]: addedDoc._id },
    });
};

export const deleteMultipleChildren = async function (
  parentDoc,
  childrenToClear,
) {
  childrenToClear.forEach(async child => {
    if (config.EXCLUDEFROMDELETE.includes(child.toLowerCase())) return;
    await mongoose.model(convertCase(child, "pascal")).deleteMany({
      _id: { $in: parentDoc[`${convertCase(child, "camel")}List`] },
    });
  });
};
