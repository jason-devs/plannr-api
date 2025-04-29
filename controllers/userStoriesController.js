/* eslint-disable no-console */
import UserStory from "../models/userStoriesModel.js";
import AppError from "../utils/appError.js";
import { catchAsyncErrors } from "../utils/helpers.js";

export const createUserStory = catchAsyncErrors(async (req, res, next) => {
  const { story, role } = req.body;
  const { projectId } = req.params;

  const newUserStory = await UserStory.create({
    story,
    role,
    completed: false,
    project: projectId,
  });

  res.status(201).json({
    status: "success",
    data: {
      newUserStory,
    },
  });
});

export const getUserStories = catchAsyncErrors(async (req, res, next) => {
  const { projectId } = req.params;

  console.log(req.params);

  const userStories = await UserStory.find({ project: projectId });

  res.status(200).json({
    status: "success",
    data: {
      userStories,
    },
  });
});

export const getUserStory = catchAsyncErrors(async (req, res, next) => {
  const { projectId, userStoryId } = req.params;

  const document = await UserStory.findOne({
    _id: userStoryId,
    project: projectId,
  });

  if (!document) {
    return next(
      new AppError("Apologies, no User Story was found with that ID."),
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      document,
    },
  });
});

export const updateUserStory = catchAsyncErrors(async (req, res, next) => {
  const { projectId, userStoryId } = req.params;
  const { story, role, completed, position } = req.body;

  const updatedUserStory = await UserStory.findOneAndUpdate(
    { _id: userStoryId, project: projectId },
    { story, role, completed, position },
    { new: true, runValidators: true },
  );

  if (!updatedUserStory) {
    return next(
      new AppError(
        `Sorry, couldn't update because we find any document with that ID: ${userStoryId}`,
        404,
      ),
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      updatedUserStory,
    },
  });
});

export const deleteUserStory = catchAsyncErrors(async (req, res, next) => {
  const { projectId, userStoryId } = req.params;
  const deletedUserStory = await UserStory.findOneAndDelete({
    _id: userStoryId,
    project: projectId,
  });

  if (!deletedUserStory) {
    return next(
      new AppError(
        `Sorry, couldn't delete because we find any document with that ID: ${userStoryId}`,
        404,
      ),
    );
  }

  res.status(204).json({
    status: "successful",
    data: null,
  });
});

export const deleteUserStories = catchAsyncErrors(async (req, res, next) => {
  const { projectId } = req.params;

  const deleteCount = await UserStory.deleteMany({ project: projectId });

  res.status(200).json({
    status: "success",
    deleteCount,
  });
});
