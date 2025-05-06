import mongoose from "mongoose";
import * as config from "../utils/config.js";
import { convertCase } from "../utils/helpers.js";

const generateParentInfoDoc = doc => {
  const { name, parent, subDoc } = doc.constructor.schema.staticSettings;
  const parentModel = mongoose.model(convertCase(parent, "pascal"));
  const parentPath = subDoc
    ? `${convertCase(subDoc, "camel")}.${convertCase(name, "camel")}List`
    : `${convertCase(name, "camel")}List`;
  const parentId =
    parent === "user" ? doc.createdBy : doc[convertCase(parent, "camel")];

  return { parentModel, parentId, parentPath };
};

const generateParentInfoThat = that => {
  const { name, parent, subDoc } = that.schema.staticSettings;
  const query = that.getQuery();
  const parentModel = mongoose.model(convertCase(parent, "pascal"));
  const parentPath = subDoc
    ? `${convertCase(subDoc, "camel")}.${convertCase(name, "camel")}List`
    : `${convertCase(name, "camel")}List`;
  const parentId =
    parent === "user" ? query.createdBy : query[convertCase(parent, "camel")];

  return { parentModel, parentId, parentPath };
};

export const afterDeleteOne = async function (deletedDoc) {
  const { parentModel, parentId, parentPath } =
    generateParentInfoDoc(deletedDoc);

  await parentModel.findByIdAndUpdate(parentId, {
    $pull: { [parentPath]: deletedDoc._id },
  });
};

export const afterDeleteMany = async function (that) {
  const { parentModel, parentId, parentPath } = generateParentInfoThat(that);

  await parentModel.findByIdAndUpdate(parentId, {
    [parentPath]: [],
  });
};

export const afterAddOne = async function (addedDoc) {
  const { parentModel, parentId, parentPath } = generateParentInfoDoc(addedDoc);

  await parentModel.findByIdAndUpdate(parentId, {
    $push: { [parentPath]: addedDoc._id },
  });
};

export const deleteMultipleChildren = async function (parentDoc) {
  const { children } = parentDoc.constructor.schema.staticSettings;

  children.forEach(async child => {
    if (config.EXCLUDEFROMDELETE.includes(child.toLowerCase())) return;
    await mongoose.model(convertCase(child, "pascal")).deleteMany({
      _id: { $in: parentDoc[`${convertCase(child, "camel")}List`] },
    });
  });
};
