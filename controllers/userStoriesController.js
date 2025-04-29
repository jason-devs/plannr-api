/* eslint-disable no-console */
import UserStory from "../models/userStoriesModel.js";
import AppError from "../utils/appError.js";
import { catchAsyncErrors } from "../utils/helpers.js";

export const createUserStory = catchAsyncErrors(async (req, res, next) => {
  const { story, role } = req.body;
  const { id } = req.params;

  const newUserStory = await UserStory.create({
    story,
    role,
    completed: false,
    project: id,
  });

  res.status(201).json({
    status: "success",
    data: {
      newUserStory,
    },
  });
});

export const getUserStories = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const userStories = await UserStory.find({ project: id });

  res.status(200).json({
    status: "success",
    data: {
      userStories,
    },
  });
});

export const getUserStory = catchAsyncErrors(async (req, res, next) => {
  const { userStoryId } = req.params;

  const document = await UserStory.findOneById(userStoryId);

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
  const { userStoryId } = req.params;
  const { story, role, completed, position } = req.body;

  const updatedUserStory = await UserStory.findByIdAndUpdate(
    userStoryId,
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
  const { userStoryId } = req.params;
  const deletedUserStory = await UserStory.findByIdAndDelete(userStoryId);

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
  const { id } = req.params;

  const deleteCount = await UserStory.deleteMany({ project: id });

  res.status(200).json({
    status: "success",
    deleteCount,
  });
});
