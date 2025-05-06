import mongoose from "mongoose";
import { catchAsyncErrors, convertCase } from "../utils/helpers.js";
import AppError from "../utils/appError.js";

const updateRefMatrix = {
  embedded: {
    inArray: {
      multiple: {
        add: ({ id, ref, childRef }) => ({
          $addToSet: {
            [`${convertCase(childRef, "camel")}.${convertCase(ref, "camel")}List`]:
              id,
          },
        }),

        remove: ({ id, ref, childRef }) => ({
          $pull: {
            [`${convertCase(childRef, "camel")}.${convertCase(ref, "camel")}List`]:
              { $in: id },
          },
        }),
      },

      single: {
        add: ({ id, ref, childRef }) => ({
          $addToSet: {
            [`${convertCase(childRef, "camel")}.${convertCase(ref, "camel")}List`]:
              id,
          },
        }),
        remove: ({ id, ref, childRef }) => ({
          $pull: {
            [`${convertCase(childRef, "camel")}.${convertCase(ref, "camel")}List`]:
              id,
          },
        }),
      },
    },

    notInArray: {
      single: {
        add: ({ id, ref, childRef }) => ({
          $set: {
            [`${convertCase(childRef, "camel")}.${convertCase(ref, "camel")}List`]:
              id,
          },
        }),
        remove: ({ ref, childRef }) => ({
          [`${convertCase(childRef, "camel")}.${convertCase(ref, "camel")}List`]:
            null,
        }),
      },
    },
  },

  notEmbedded: {
    inArray: {
      multiple: {
        add: ({ id, ref }) => ({
          $addToSet: { [`${convertCase(ref, "camel")}List`]: id },
        }),

        remove: ({ id, ref }) => ({
          $pull: { [`${convertCase(ref, "camel")}List`]: { $in: id } },
        }),
      },

      single: {
        add: ({ id, ref }) => ({
          $addToSet: { [`${convertCase(ref, "camel")}List`]: id },
        }),
        remove: ({ id, ref }) => ({
          $pull: { [`${convertCase(ref, "camel")}List`]: id },
        }),
      },
    },

    notInArray: {
      single: {
        add: ({ id, ref }) => ({
          $set: { [`${convertCase(ref, "camel")}`]: id },
        }),
        remove: ({ ref }) => ({
          [`${convertCase(ref, "camel")}`]: null,
        }),
      },
    },
  },
};

const queryMatrix = {
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

  req.body.createdBy = id;

  return { id, role };
};

const generateAllQuery = async (req, Model, next, action) => {
  const { id, role } = await getCurrentUser(req, next);

  const { parent, privacy } = Model.schema.staticSettings;

  const restriction = queryMatrix[action][role][privacy](id);

  let query = { ...restriction };

  if (parent !== "none") {
    const parentKey =
      parent === "user" ? "createdBy" : convertCase(parent, "camel");

    const parentId =
      parent === "user" ? id : req.params[`${convertCase(parent, "camel")}Id`];

    query = {
      ...restriction,
      [parentKey]: parentId,
    };
  }

  return query;
};

const generateOneQuery = async (req, Model, next, action) => {
  const { id, role } = await getCurrentUser(req, next);

  const { name, parent, privacy, embedded } = Model.schema.staticSettings;

  const restriction = queryMatrix[action][role][privacy](id);

  let query = {
    ...restriction,
    _id: req.params[`${convertCase(name, "camel")}Id`],
  };

  if (parent !== "none" && !embedded) {
    const parentKey =
      parent === "user" ? "createdBy" : convertCase(parent, "camel");

    const parentId =
      parent === "user" ? id : req.params[`${convertCase(parent, "camel")}Id`];

    query = {
      ...restriction,
      [parentKey]: parentId,
      _id: req.params[`${convertCase(name, "camel")}Id`],
    };
  }

  if (embedded) {
    query = {
      ...restriction,
      _id: req.params[`${convertCase(parent, "camel")}Id`],
    };
  }

  return query;
};

const generateBody = async (req, Model, next) => {
  let body;
  const { id } = await getCurrentUser(req, next, false);
  req.body.createdBy = id;

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
    const body = await generateBody(req, Model, next);

    const { fullSel, fullPop } = Model.schema.staticSettings;

    const newDocUnpop = await Model.create(body);

    const newDoc = await Model.findById(newDocUnpop._id)
      .populate(fullPop)
      .select(fullSel);

    res.status(201).json({
      status: "success",
      data: {
        newDoc,
      },
    });
  });

export const getAll = Model =>
  catchAsyncErrors(async (req, res, next) => {
    const query = await generateAllQuery(req, Model, next, "find");

    const { overviewSel, overviewPop } = Model.schema.staticSettings;

    const docs = await Model.find(query)
      .populate(overviewPop)
      .select(overviewSel);

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
    const query = await generateOneQuery(req, Model, next, "find");

    const { fullSel, fullPop } = Model.schema.staticSettings;

    const doc = await Model.findOne(query).populate(fullPop).select(fullSel);

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

export const getOneEmbedded = Model =>
  catchAsyncErrors(async (req, res, next) => {
    const { name, parent } = Model.schema.staticSettings;

    const parentDoc = await mongoose
      .model(convertCase(parent, "pascal"))
      .findById(req.params[`${convertCase(parent, "camel")}Id`]);

    const doc = parentDoc[convertCase(name, "camel")];

    if (!doc) {
      return next(
        new AppError(
          "No embedded document was found with that query. Apologies.",
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

export const updateOne = Model =>
  catchAsyncErrors(async (req, res, next) => {
    const query = await generateOneQuery(req, Model, next, "update");

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
    const query = await generateOneQuery(req, Model, next, "delete");

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
    const query = await generateAllQuery(req, Model, next, "delete");

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

export const updateReference = Model =>
  catchAsyncErrors(async (req, res, next) => {
    const {
      name,
      parent,
      updateableRefs,
      fullSel,
      fullPop,
      embedded = false,
    } = Model.schema.staticSettings;

    const { action, ref, array, id } = req.body;

    const childRef = embedded ? name : "UNUSED";
    const isEmbedded = embedded ? "embedded" : "notEmbedded";
    const multiple = Array.isArray(id) ? "multiple" : "single";
    const inArray = array ? "inArray" : "notInArray";

    if (!updateableRefs || !updateableRefs.includes(ref)) {
      return next(
        new AppError(
          updateableRefs
            ? `Cannot perform this action because you cannot update the "${ref}" on this document. You can update ${updateableRefs.join(" OR ")}`
            : `Updateable refs were not provieded for ${name}. Please address.`,
          400,
        ),
      );
    }

    if (!action || !["add", "remove"].includes(action)) {
      return next(
        new AppError(
          `Cannot perform this action without a valid action, your options are "action": "add" OR "action": "remove"`,
          400,
        ),
      );
    }

    if (!ref) {
      return next(
        new AppError(
          `Cannot perform this action without a valid ref, your options are `,
          400,
        ),
      );
    }

    if (array === undefined) {
      return next(
        new AppError(
          `Cannot perform this action without a valid "array" property, your options are true, or false and you're telling us if this property is STORED as an array in the document.`,
          400,
        ),
      );
    }

    const query = await generateOneQuery(req, Model, next, "update");

    const update = updateRefMatrix[isEmbedded][inArray][multiple][action]({
      id,
      ref,
      childRef,
    });

    let updatedDoc;
    if (embedded) {
      updatedDoc = await mongoose
        .model(convertCase(parent, "pascal"))
        .findOneAndUpdate(query, update, {
          new: true,
          runValidators: true,
        })
        .populate(fullPop)
        .select(fullSel);
    }

    if (!embedded) {
      updatedDoc = await Model.findOneAndUpdate(query, update, {
        new: true,
        runValidators: true,
      })
        .populate(fullPop)
        .select(fullSel);
    }

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
