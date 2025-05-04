import { catchAsyncErrors, convertCase } from "../utils/helpers.js";
import AppError from "../utils/appError.js";

const authorize = (req, next) => {
  const { _id: id } = req.currentUser;

  if (!id) {
    return next(
      new AppError(
        "You cannot create new documents when logged out. Try logging in first.",
        401,
      ),
    );
  }

  req.body.createdBy = id;

  return id;
};

const generateAllQuery = (req, Model, next) => {
  const id = authorize(req, next);

  const { parent, isPrivate, checkCustom } = Model.schema.staticSettings;

  const makePrivate = isPrivate ? { createdBy: id } : {};
  const filterCustom = checkCustom ? { custom: true } : {};

  let query = { ...makePrivate, ...filterCustom };

  if (parent !== "none") {
    const parentKey =
      parent === "user" ? "createdBy" : convertCase(parent, "camel");

    const parentId =
      parent === "user" ? id : req.params[`${convertCase(parent, "camel")}Id`];

    query = {
      ...makePrivate,
      ...filterCustom,
      [parentKey]: parentId,
    };
  }

  return query;
};

const generateOneQuery = (req, Model, next) => {
  const id = authorize(req, next);

  const { name, parent, isPrivate, checkCustom } = Model.schema.staticSettings;

  const makePrivate = isPrivate ? { createdBy: id } : {};
  const filterCustom = checkCustom ? { custom: true } : {};

  let query = {
    ...makePrivate,
    ...filterCustom,
    _id: req.params[`${convertCase(name, "camel")}Id`],
  };

  if (parent !== "none") {
    const parentKey =
      parent === "user" ? "createdBy" : convertCase(parent, "camel");

    const parentId =
      parent === "user" ? id : req.params[`${convertCase(parent, "camel")}Id`];

    query = {
      ...makePrivate,
      ...filterCustom,
      [parentKey]: parentId,
      _id: req.params[`${convertCase(name, "camel")}Id`],
    };
  }

  return query;
};

const generateBody = (req, Model, next) => {
  let body;
  authorize(req, next);

  const { parent } = Model.schema.staticSettings;

  if (parent === "none") {
    body = { ...req.body };
  }

  if (parent !== "none") {
    const userParent = { ...req.body };
    const otherParent = {
      ...req.body,
      [convertCase(parent, "camel")]:
        req.params[`${convertCase(parent, "camel")}Id`],
    };

    body = parent === "user" ? userParent : otherParent;
  }

  return body;
};

export const createOne = Model =>
  catchAsyncErrors(async (req, res, next) => {
    const body = generateBody(req, Model, next);

    const newDoc = await Model.create(body);

    res.status(201).json({
      status: "success",
      data: {
        newDoc,
      },
    });
  });

export const getAll = Model =>
  catchAsyncErrors(async (req, res, next) => {
    const query = generateAllQuery(req, Model, next);

    const docs = await Model.find(query);

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: {
        docs,
      },
    });
  });

export const getOne = Model =>
  catchAsyncErrors(async (req, res, next) => {
    const query = generateOneQuery(req, Model, next);

    const doc = await Model.findOne(query);

    if (!doc) {
      return next(
        new AppError("No document was found with that query. Apologies.", 404),
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

export const updateOne = Model =>
  catchAsyncErrors(async (req, res, next) => {
    const query = generateOneQuery(req, Model, next);

    const updatedDoc = await Model.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc) {
      return next(
        new AppError(
          "No document was found with that query, so we couldn't do the update. Apologies.",
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

export const deleteOne = Model =>
  catchAsyncErrors(async (req, res, next) => {
    const query = generateOneQuery(req, Model, next);

    const { deleteType } = Model.schema.staticSettings;

    let deletedDoc;
    if (deleteType === "soft") {
      deletedDoc = await Model.findOneAndUpdate(
        query,
        { active: false },
        { new: true },
      );
    }

    if (deleteType === "hard") {
      deletedDoc = await Model.findOneAndDelete(query);
    }

    if (!deletedDoc) {
      return next(
        new AppError(
          "No document was found with that query, so we couldn't delete it. Apologies.",
          404,
        ),
      );
    }

    res.status(204).json({
      status: "successful",
      data: null,
    });
  });

export const deleteAll = Model =>
  catchAsyncErrors(async (req, res, next) => {
    const query = generateAllQuery(req, Model, next);

    const { deleteType } = Model.schema.staticSettings;

    let deleteCount;
    if (deleteType === "soft") {
      const deactivatedDocs = await Model.updateMany(query, { active: false });
      deleteCount = deactivatedDocs.modifiedCount;
    }

    if (deleteType === "hard") {
      deleteCount = await Model.deleteMany(query);
    }

    res.status(200).json({
      status: "success",
      deleteCount,
    });
  });

export const updateReference = (Model, refName) =>
  catchAsyncErrors(async (req, res, next) => {
    const { action } = req.query;

    if (!action || !["add", "remove"].includes(action)) {
      return next(
        new AppError(
          `Cannot perform this action without a valid action query, your options are "action=add" OR "action=remove"`,
          400,
        ),
      );
    }

    const query = generateOneQuery(req, Model, next);

    let update;

    if (action === "add") {
      update = {
        $addToSet: {
          [`${convertCase(refName, "camel")}List`]:
            req.params[`${convertCase(refName, "camel")}Id`],
        },
      };
    }

    if (action === "remove") {
      update = {
        $pull: {
          [`${convertCase(refName, "camel")}List`]:
            req.params[`${convertCase(refName, "camel")}Id`],
        },
      };
    }

    const updatedDoc = await Model.findOneAndUpdate(query, update, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc) {
      return next(
        new AppError(
          `No document was found with that query, so we couldn't do the update. Apologies.`,
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

export const cleanupCollection = async Model => {
  const deletedCount = await Model.deleteMany({ active: false });
  // eslint-disable-next-line no-console
  console.log(deletedCount);
};
