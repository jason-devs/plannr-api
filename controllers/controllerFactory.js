import { catchAsyncErrors } from "../utils/helpers.js";
import AppError from "../utils/appError.js";

export const createOne = (Model, parentProperty, paramName) =>
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

    if (parentProperty) {
      parent = { [parentProperty]: req.params[paramName] };
    }

    const newDoc = await Model.create({ ...req.body, ...parent });

    res.status(201).json({
      status: "success",
      data: {
        newDoc,
      },
    });
  });

export const getAll = (Model, parentProperty, paramName) =>
  catchAsyncErrors(async (req, res, next) => {
    let query = {};
    if (parentProperty) {
      query = { [parentProperty]: req.params[paramName] };
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

export const getOne = (Model, id, parentProperty, paramName) =>
  catchAsyncErrors(async (req, res, next) => {
    let query = { _id: req.params[id] };
    if (parentProperty) {
      query = { _id: req.params[id], [parentProperty]: req.params[paramName] };
    }

    const doc = await Model.findOne(query);

    if (!doc) {
      return next(
        new AppError(
          `Sorry, couldn't find any document with that ID: ${req.params[id]}`,
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

export const updateOne = (Model, id, parentProperty, paramName) =>
  catchAsyncErrors(async (req, res, next) => {
    let query = { _id: req.params[id] };
    if (parentProperty) {
      query = { _id: req.params[id], [parentProperty]: req.params[paramName] };
    }

    const updatedDoc = await Model.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc) {
      return next(
        new AppError(
          `Sorry, couldn't update because we find any document with that ID: ${req.params[id]}`,
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

export const deleteOne = (Model, id, parentProperty, paramName) =>
  catchAsyncErrors(async (req, res, next) => {
    let query = { _id: req.params[id] };
    if (parentProperty) {
      query = { _id: req.params[id], [parentProperty]: req.params[paramName] };
    }

    const deletedDoc = await Model.findOneAndDelete(query);

    if (!deletedDoc) {
      return next(
        new AppError(
          `Sorry, couldn't delete because we find any document with that ID: ${id}`,
          404,
        ),
      );
    }

    res.status(204).json({
      status: "successful",
      data: null,
    });
  });

export const deleteAll = (Model, parentProperty, paramName) =>
  catchAsyncErrors(async (req, res, next) => {
    const { _id: id } = req.currentUser;
    let query = { user: id };
    if (parentProperty) {
      query = { [parentProperty]: req.params[paramName] };
    }

    const deleteCount = await Model.deleteMany(query);

    res.status(200).json({
      status: "success",
      deleteCount,
    });
  });
