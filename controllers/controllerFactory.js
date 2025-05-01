import { catchAsyncErrors, convertCase } from "../utils/helpers.js";
import AppError from "../utils/appError.js";

export const createOne = (Model, parentName) =>
  catchAsyncErrors(async (req, res, next) => {
    const { _id: id } = req.currentUser;

    if (!id) {
      return next(
        new AppError(
          "You cannot create new documents when logged out. Try logging in first.",
        ),
      );
    }

    let parent = { user: id };

    if (parentName) {
      parent = {
        [convertCase(parentName, "camel")]:
          req.params[`${convertCase(parentName, "camel")}Id`],
      };
    }

    const newDoc = await Model.create({ ...req.body, ...parent });

    res.status(201).json({
      status: "success",
      data: {
        newDoc,
      },
    });
  });

export const getAll = (Model, parentName) =>
  catchAsyncErrors(async (req, res, next) => {
    let query = {};
    if (parentName) {
      query = {
        [convertCase(parentName, "camel")]:
          req.params[`${convertCase(parentName, "camel")}Id`],
      };
    }

    const docs = await Model.find(query);

    if (!docs) {
      return next(
        new AppError(`Sorry, couldn't find any docs with that query.`, 404),
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        docs,
      },
    });
  });

export const getOne = (Model, childName, parentName) =>
  catchAsyncErrors(async (req, res, next) => {
    let query = { _id: req.params[`${convertCase(childName, "camel")}Id`] };
    if (parentName) {
      query = {
        _id: req.params[`${convertCase(childName, "camel")}Id`],
        [convertCase(parentName, "camel")]:
          req.params[`${convertCase(parentName, "camel")}Id`],
      };
    }

    const doc = await Model.findOne(query);

    if (!doc) {
      return next(
        new AppError(
          `Sorry, couldn't find any document with that ID: ${req.params[`${convertCase(childName, "camel")}Id`]}`,
          404,
        ),
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

export const updateOne = (Model, childName, parentName) =>
  catchAsyncErrors(async (req, res, next) => {
    let query = { _id: req.params[`${convertCase(childName, "camel")}Id`] };
    if (parentName) {
      query = {
        _id: req.params[`${convertCase(childName, "camel")}Id`],
        [convertCase(parentName, "camel")]:
          req.params[`${convertCase(parentName, "camel")}Id`],
      };
    }

    const updatedDoc = await Model.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc) {
      return next(
        new AppError(
          `Sorry, couldn't update because we find any document with that ID: ${req.params[`${convertCase(childName, "camel")}Id`]}`,
          404,
        ),
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        updatedDoc,
      },
    });
  });

export const deleteOne = (Model, childName, parentName) =>
  catchAsyncErrors(async (req, res, next) => {
    let query = { _id: req.params[`${convertCase(childName, "camel")}Id`] };
    if (parentName) {
      query = {
        _id: req.params[`${convertCase(childName, "camel")}Id`],
        [convertCase(parentName, "camel")]:
          req.params[`${convertCase(parentName, "camel")}Id`],
      };
    }

    const deletedDoc = await Model.findOneAndDelete(query);

    if (!deletedDoc) {
      return next(
        new AppError(
          `Sorry, couldn't delete because we find any document with that ID: ${childName}`,
          404,
        ),
      );
    }

    res.status(204).json({
      status: "successful",
      data: null,
    });
  });

export const deleteAll = (Model, parentName) =>
  catchAsyncErrors(async (req, res, next) => {
    const { _id: id } = req.currentUser;
    let query = { user: id };
    if (parentName) {
      query = {
        [convertCase(parentName, "camel")]:
          req.params[`${convertCase(parentName, "camel")}Id`],
      };
    }

    const deleteCount = await Model.deleteMany(query);

    res.status(200).json({
      status: "success",
      deleteCount,
    });
  });
