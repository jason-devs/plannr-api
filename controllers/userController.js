import AppError from "../utils/appError.js";
import { catchAsyncErrors } from "../utils/helpers.js";
import { logout } from "../controllers/authController.js";
import User from "../models/userModel.js";

export const getMyAccount = catchAsyncErrors(async (req, res, next) => {
  const { _id: id } = req.currentUser;
  const user = await User.findById(id);

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const updateMyAccount = catchAsyncErrors(async (req, res, next) => {
  const { _id: id } = req.currentUser;

  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError(`You cannot update your password at this route. Use the dedicated update password route.`))
  }

  const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

  res.status(200).json({
    status: "success",
    data: {
      updatedUser,
    }
  });
});

export const deleteMyAccount = catchAsyncErrors(async (req, res, next) => {
  const { NODE_ENV } = process.env;
  const { _id: id } = req.currentUser;

  await User.findByIdAndUpdate(id, { active: false });

  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 1000 * 30),
    httpOnly: true,
    secure: NODE_ENV === "production"
  };

  res.cookie("jwt", "loggedout", cookieOptions);

  res.status(200).json({
    status: "success",
  });
});

