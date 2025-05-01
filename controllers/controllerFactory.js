import { catchAsyncErrors, convertCase } from "../utils/helpers.js";
import AppError from "../utils/appError.js";

export const createOne = (Model, parentName) =>
  catchAsyncErrors(async (req, res, next) => {
    if (parentName === "user") {
      const { _id: id } = req.currentUser;

      if (!id) {
        return next(
          new AppError(
            "You cannot create new documents when logged out. Try logging in first.",
          ),
        );
      }

      const parent = { user: id };

      const newDoc = await Model.create({ ...req.body, ...parent });

      return res.status(201).json({
        status: "success",
        data: {
          newDoc,
        },
      });
    }

    if (parentName) {
      const parent = {
        [convertCase(parentName, "camel")]:
          req.params[`${convertCase(parentName, "camel")}Id`],
      };

      const newDoc = await Model.create({ ...req.body, ...parent });

      return res.status(201).json({
        status: "success",
        data: {
          newDoc,
        },
      });
    }

    const newDoc = await Model.create({ ...req.body });

    return res.status(201).json({
      status: "success",
      data: {
        newDoc,
      },
    });
  });

export const getAll = (Model, parentName) =>
  catchAsyncErrors(async (req, res, next) => {
    if (parentName === "user") {
      const { _id: id } = req.currentUser;

      if (!id) {
        return next(
          new AppError(
            "You cannot create new documents when logged out. Try logging in first.",
          ),
        );
      }

      const query = { user: id };

      const docs = await Model.find(query);

      if (!docs) {
        return next(
          new AppError(`Sorry, couldn't find any docs with that query.`, 404),
        );
      }

      return res.status(200).json({
        status: "success",
        data: {
          docs,
        },
      });
    }

    if (parentName) {
      const query = {
        [convertCase(parentName, "camel")]:
          req.params[`${convertCase(parentName, "camel")}Id`],
      };

      const docs = await Model.find(query);

      if (!docs) {
        return next(
          new AppError(`Sorry, couldn't find any docs with that query.`, 404),
        );
      }

      return res.status(200).json({
        status: "success",
        data: {
          docs,
        },
      });
    }

    const docs = await Model.find();

    if (!docs) {
      return next(
        new AppError(`Sorry, couldn't find any docs with that query.`, 404),
      );
    }

    return res.status(200).json({
      status: "success",
      data: {
        docs,
      },
    });
  });

export const getOne = (Model, childName, parentName) =>
  catchAsyncErrors(async (req, res, next) => {
    if (parentName === "user") {
      const { _id: id } = req.currentUser;

      if (!id) {
        return next(
          new AppError(
            "You cannot create new documents when logged out. Try logging in first.",
          ),
        );
      }

      const query = {
        user: id,
        _id: req.params[`${convertCase(childName, "camel")}Id`],
      };

      const doc = await Model.findOne(query);

      if (!doc) {
        return next(
          new AppError(
            `Sorry, couldn't find any document with that ID: ${req.params[`${convertCase(childName, "camel")}Id`]}`,
            404,
          ),
        );
      }

      return res.status(200).json({
        status: "success",
        data: {
          doc,
        },
      });
    }

    if (parentName) {
      const query = {
        _id: req.params[`${convertCase(childName, "camel")}Id`],
        [convertCase(parentName, "camel")]:
          req.params[`${convertCase(parentName, "camel")}Id`],
      };

      const doc = await Model.findOne(query);

      if (!doc) {
        return next(
          new AppError(
            `Sorry, couldn't find any document with that ID: ${req.params[`${convertCase(childName, "camel")}Id`]}`,
            404,
          ),
        );
      }

      return res.status(200).json({
        status: "success",
        data: {
          doc,
        },
      });
    }

    const doc = await Model.findOne({
      _id: req.params[`${convertCase(childName, "camel")}Id`],
    });

    if (!doc) {
      return next(
        new AppError(
          `Sorry, couldn't find any document with that ID: ${req.params[`${convertCase(childName, "camel")}Id`]}`,
          404,
        ),
      );
    }

    return res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

export const updateOne = (Model, childName, parentName) =>
  catchAsyncErrors(async (req, res, next) => {
    if (parentName === "user") {
      const { _id: id } = req.currentUser;

      if (!id) {
        return next(
          new AppError(
            "You cannot create new documents when logged out. Try logging in first.",
          ),
        );
      }

      const query = {
        user: id,
        _id: req.params[`${convertCase(childName, "camel")}Id`],
      };

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

      return res.status(200).json({
        status: "success",
        data: {
          updatedDoc,
        },
      });
    }

    if (parentName) {
      const query = {
        _id: req.params[`${convertCase(childName, "camel")}Id`],
        [convertCase(parentName, "camel")]:
          req.params[`${convertCase(parentName, "camel")}Id`],
      };

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

      return res.status(200).json({
        status: "success",
        data: {
          updatedDoc,
        },
      });
    }

    const query = {
      _id: req.params[`${convertCase(childName, "camel")}Id`],
    };

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

    return res.status(200).json({
      status: "success",
      data: {
        updatedDoc,
      },
    });
  });

export const deleteOne = (Model, childName, parentName) =>
  catchAsyncErrors(async (req, res, next) => {
    if (parentName === "user") {
      const { _id: id } = req.currentUser;

      if (!id) {
        return next(
          new AppError(
            "You cannot create new documents when logged out. Try logging in first.",
          ),
        );
      }

      const query = {
        user: id,
        _id: req.params[`${convertCase(childName, "camel")}Id`],
      };

      const deletedDoc = await Model.findOneAndDelete(query);

      if (!deletedDoc) {
        return next(
          new AppError(
            `Sorry, couldn't delete because we find any document with that ID: ${childName}`,
            404,
          ),
        );
      }

      return res.status(204).json({
        status: "successful",
        data: null,
      });
    }

    if (parentName) {
      const query = {
        _id: req.params[`${convertCase(childName, "camel")}Id`],
        [convertCase(parentName, "camel")]:
          req.params[`${convertCase(parentName, "camel")}Id`],
      };

      const deletedDoc = await Model.findOneAndDelete(query);

      if (!deletedDoc) {
        return next(
          new AppError(
            `Sorry, couldn't delete because we find any document with that ID: ${childName}`,
            404,
          ),
        );
      }

      return res.status(204).json({
        status: "successful",
        data: null,
      });
    }

    const query = {
      _id: req.params[`${convertCase(childName, "camel")}Id`],
    };

    const deletedDoc = await Model.findOneAndDelete(query);

    if (!deletedDoc) {
      return next(
        new AppError(
          `Sorry, couldn't delete because we find any document with that ID: ${childName}`,
          404,
        ),
      );
    }

    return res.status(204).json({
      status: "successful",
      data: null,
    });
  });

export const deleteAll = (Model, parentName) =>
  catchAsyncErrors(async (req, res, next) => {
    if (parentName === "user") {
      const { _id: id } = req.currentUser;

      if (!id) {
        return next(
          new AppError(
            "You cannot create new documents when logged out. Try logging in first.",
          ),
        );
      }

      const query = { user: id };

      const deleteCount = await Model.deleteMany(query);

      return res.status(200).json({
        status: "success",
        deleteCount,
      });
    }

    if (parentName) {
      const query = {
        [convertCase(parentName, "camel")]:
          req.params[`${convertCase(parentName, "camel")}Id`],
      };

      const deleteCount = await Model.deleteMany(query);

      return res.status(200).json({
        status: "success",
        deleteCount,
      });
    }

    const deleteCount = await Model.deleteMany();

    return res.status(200).json({
      status: "success",
      deleteCount,
    });
  });
