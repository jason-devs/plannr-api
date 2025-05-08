import mongoose from "mongoose";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";
import { catchAsyncErrors, convertCase } from "../utils/helpers.js";

const getCurrentUser = async (req, next, getRole = true) => {
  const { _id: id } = req.currentUser;
  let role = "ROLE NOT NEEDED";

  if (getRole) {
    ({ role } = await mongoose
      .model("User")
      .findById(id)
      .select("-_id role")
      .lean());
  }

  if (!id || !role) {
    return next(
      new AppError(
        "You cannot create or access some documents when logged out, or don't have the correct permissions. Try logging in first.",
        401,
      ),
    );
  }

  return { id, role };
};

const filterMatrix = {
  find: {
    admin: {
      private: () => ({}),
      custom: () => ({}),
      global: () => ({}),
    },
    user: {
      private: id => ({ createdBy: id }),
      custom: id => ({ $or: [{ custom: false }, { createdBy: id }] }),
      global: () => ({}),
    },
  },

  update: {
    admin: {
      private: () => ({}),
      custom: () => ({}),
      global: () => ({}),
    },
    user: {
      private: id => ({ createdBy: id }),
      custom: id => ({ createdBy: id }),
      global: () => ({}),
    },
  },

  delete: {
    admin: {
      private: () => ({}),
      custom: () => ({}),
      global: () => ({}),
    },
    user: {
      private: id => ({ createdBy: id }),
      custom: id => ({ createdBy: id }),
      global: () => ({}),
    },
  },
};

const sanitizeBody = (keysString, requestBody) => {
  const keys = keysString.split(" ");
  const sanitized = { ...requestBody };

  keys.forEach(key => {
    if (Object.prototype.hasOwnProperty.call(sanitized, key)) {
      delete sanitized[key];
    }
  });

  return sanitized;
};

const getModelData = Model => {
  const {
    name,
    invalidCreateKeys,
    invalidUpdateKeys,
    privacy,
    deleteType,
    overviewSel,
    overviewPop,
    fullSel,
    fullPop,
  } = Model.schema.staticSettings;

  return {
    name,
    invalidCreateKeys,
    invalidUpdateKeys,
    privacy,
    deleteType,
    overviewSel,
    overviewPop,
    fullSel,
    fullPop,
  };
};

export const createOne = Model =>
  catchAsyncErrors(async (req, res, next) => {
    const { id } = await getCurrentUser(req, next);
    const { name, invalidCreateKeys, fullSel, fullPop } = getModelData(Model);
    const body = sanitizeBody(invalidCreateKeys, req.body);

    const createdDoc = await Model.create({ ...body, createdBy: id });

    const newDoc = await Model.findById(createdDoc._id)
      .select(fullSel)
      .populate(fullPop);

    if (!newDoc) {
      return next(
        new AppError(
          `Something went wrong creating your new ${convertCase(name, "title")}`,
        ),
      );
    }

    res.status(201).json({
      status: "success",
      data: {
        newDoc,
      },
    });
  });

export const getAll = Model =>
  catchAsyncErrors(async (req, res, next) => {
    const { role, id } = await getCurrentUser(req, next, true);
    const { privacy, overviewSel, overviewPop } = getModelData(Model);

    const filter = filterMatrix.find[role][privacy](id);

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query.populate(overviewPop).select(overviewSel);

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
    const { role, id } = await getCurrentUser(req, next, true);
    const { name, privacy, fullSel, fullPop } = getModelData(Model);

    const docId = req.params[`${convertCase(name, "camel")}Id`];

    const filter = filterMatrix.find[role][privacy](id);

    const doc = await Model.findOne({ ...filter, _id: docId })
      .select(fullSel)
      .populate(fullPop);

    if (!doc) {
      return next(
        new AppError(
          `Couldn't find any ${convertCase(name, "title")} with that ID: ${docId}`,
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

export const updateOne = Model =>
  catchAsyncErrors(async (req, res, next) => {
    const { role, id } = await getCurrentUser(req, next, true);
    const { name, privacy, invalidUpdateKeys, fullSel, fullPop } =
      getModelData(Model);
    const body = sanitizeBody(invalidUpdateKeys, req.body);

    const docId = req.params[`${convertCase(name, "camel")}Id`];

    const filter = filterMatrix.update[role][privacy](id);

    const updatedDoc = await Model.findOneAndUpdate(
      { ...filter, _id: docId },
      body,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate(fullPop)
      .select(fullSel);

    if (!updatedDoc) {
      return next(
        new AppError(
          `Something went wrong updating this ${convertCase(name, "title")}, please start by checking the ID: ${docId}`,
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
    const { role, id } = await getCurrentUser(req, next, true);
    const { name, privacy, deleteType } = getModelData(Model);

    const filter = filterMatrix.delete[role][privacy](id);

    const docId = req.params[`${convertCase(name, "camel")}Id`];

    const query = { ...filter, _id: docId };

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
          `Something went wrong deleting this ${convertCase(name, "title")}, please start by checking the ID: ${docId}`,
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
    const { role, id } = await getCurrentUser(req, next, true);
    const { privacy, deleteType } = getModelData(Model);

    const filter = filterMatrix.delete[role][privacy](id);
    let deleteCount;

    if (deleteType === "soft") {
      const featuresUpdate = new APIFeatures(
        Model.updateMany(filter, { active: false }),
        req.query,
        "updateMany",
      ).filter();

      const deactivatedDocs = await featuresUpdate.query;
      deleteCount = deactivatedDocs.modifiedCount;
    }

    if (deleteType === "hard") {
      const featuresDelete = new APIFeatures(
        Model.deleteMany(filter),
        req.query,
        "deleteMany",
      ).filter();

      deleteCount = await featuresDelete.query;
    }

    res.status(200).json({
      status: "success",
      deleteCount,
    });
  });

export const updateReference = () => "DEPRECATED";
