import crypto from "crypto";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import User from "../models/userModel.js";
import ApiKey from "../models/apiKeyModel.js";
import AppError from "../utils/appError.js";
import { catchAsyncErrors } from "../utils/helpers.js";
import sendEmail from "../utils/email.js";

export const restrict =
  (...roles) =>
  (req, res, next) => {
    const { role } = req.user;
    if (!roles.includes(role)) {
      return next(
        new AppError(
          `You are not permitted to access this feature, sorry!`,
          401,
        ),
      );
    }
    next();
  };

const signJWT = id => {
  const { JWT_SECRET, JWT_EXPIRY } = process.env;
  const token = jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
  return token;
};

const sendJWT = (user, token, res) => {
  const { NODE_ENV, JWT_COOKIE_EXPIRY } = process.env;

  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: NODE_ENV === "production",
  };

  if (NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError(
        `Cannot log you in without both your email, and password!`,
        400,
      ),
    );
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(
      new AppError(
        `Email or password is not correct, please check and try again!`,
        401,
      ),
    );
  }

  const { _id: id } = user;

  user.password = undefined;

  const token = signJWT(id);

  sendJWT(user, token, res);
});

export const logout = (req, res, next) => {
  const { NODE_ENV } = process.env;
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 1000 * 30),
    httpOnly: true,
    secure: NODE_ENV === "production"
  };

  res.cookie("jwt", "loggedout", cookieOptions);

  res.status(200).json({
    status: "success",
  });
};

export const signup = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  const { _id: id } = user;

  const token = signJWT(id);
  const newUser = await User.findById(id).select("-password -role");

  sendJWT(newUser, token, res);
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(
      new AppError(
        "Apologies, no user with that email address was found. Please check and try again.",
        404,
      ),
    );
  }

  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/reset-password/${resetToken}`;

  const message = `Please follow the following link : ${resetURL} to update your password. The link will expire in 10 minutes. If you did NOT request this, please IGNORE this email!`;

  try {
    await sendEmail({
      email,
      subject: "You're password reset link is here. Valid for 10 minutes.",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "You're reset email has been sent.",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending your reset token. Please try again later.",
        500,
      ),
    );
  }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { resetToken } = req.params;
  const comparisonToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: comparisonToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new AppError(`That reset token was either invalid or expired.`, 400),
    );
  }

  const { password, passwordConfirm } = req.body;

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.changedPasswordAt = new Date(Date.now());
  await user.save();

  const { _id: id } = user;

  const token = signJWT(id);

  sendJWT(user, token, res);
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { _id: id } = req.currentUser;
  const user = await User.findById(id).select("+password");

  const { oldPassword, password, passwordConfirm } = req.body;

  if (!user || !(await user.checkPassword(oldPassword, user.password))) {
    return next(
      new AppError(
        `Something went wrong. Please check you entered the right credentials.`,
        401,
      ),
    );
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.changedPasswordAt = new Date(Date.now());
  await user.save();

  const token = signJWT(id);

  sendJWT(user, token, res);
});

export const userProtect = catchAsyncErrors(async (req, res, next) => {
  let token;
  const { NODE_ENV } = process.env;
  const { authorization } = req.headers;
  const { JWT_SECRET } = process.env;
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (token === "null" && NODE_ENV === "development") {
    token = "";
  }

  if (!token) {
    return next(
      new AppError("You need to log in before you can access this URL", 401),
    );
  }

  const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
  const { id, iat } = decoded;
  const user = await User.findById(id);

  if (!user) {
    return next(
      new AppError(`The user assigned to this login no longer exists.`, 401),
    );
  }

  const passwordChanged = user.changedPasswordAfter(iat);

  if (passwordChanged) {
    return next(
      new AppError(
        `The user assigned to this login has changed their password.`,
        401,
      ),
    );
  }

  req.currentUser = user;
  next();
});

export const keyProtect = catchAsyncErrors(async (req, res, next) => {
  const { key } = req.headers;

  if (!key) {
    return next(new AppError(`No authorization in header, please fix!`, 401));
  }

  const identifier = key.slice(0, 15);

  const apiKey = await ApiKey.findOne({ identifier });

  if (!apiKey || !(await apiKey.checkApiKey(key.slice(15), apiKey.key))) {
    return next(
      new AppError(
        `Couldn't find you in our database, please check your api key!`,
        404,
      ),
    );
  }

  next();
});

export const generateApiKey = catchAsyncErrors(async (req, res, next) => {
  const identifier = `enig_${crypto.randomBytes(5).toString("hex")}`;
  const string = crypto.randomBytes(32).toString("base64");

  const apiKey = await ApiKey.create({
    identifier,
    key: string,
  });

  if (!apiKey) {
    return next(
      new AppError(`Key creation failed, please try again later!`, 500),
    );
  }

  res.status(201).json({
    status: "success",
    key: `${identifier}${string}`,
  });
});
