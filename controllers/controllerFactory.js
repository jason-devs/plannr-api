import { catchAsyncErrors } from "../utils/helpers.js";
import AppError from "../utils/appError.js";

export const getAll = Model =>
  catchAsyncErrors(async (req, res, next) => {
    const docs = await Model.find();

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

export const deleteOne = Model =>
  catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const deletedDoc = await Model.findByIdAndDelete(id);

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

export const updateOne = Model =>
  catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const updatedDoc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc) {
      return next(
        new AppError(
          `Sorry, couldn't update because we find any document with that ID: ${id}`,
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

export const getOne = (Model, populate) =>
  catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    let doc;

    if (populate) {
      const { path } = populate;
      doc = await Model.findById(id).populate(path);
    }

    if (!populate) {
      doc = await Model.findById(id);
    }

    if (!doc) {
      return next(
        new AppError(
          `Sorry, couldn't find any document with that ID: ${id}`,
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

export const createOne = Model =>
  catchAsyncErrors(async (req, res, next) => {
    const { _id: id } = req.currentUser;
    const newDoc = await Model.create({ ...req.body, user: id });

    res.status(201).json({
      status: "success",
      data: {
        newDoc,
      },
    });
  });
