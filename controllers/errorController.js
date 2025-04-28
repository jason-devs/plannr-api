import AppError from "../utils/appError.js";

const handleJWTError = function () {
  return new AppError(
    `Authentication failed. Please try logging in again!`,
    401,
  );
};

const handleDuplicateKeyError = function (...keys) {
  return new AppError(
    `The following: (${keys}) already exists in our database, sorry!`,
    400,
  );
};

const handleValidatorError = function (message) {
  return new AppError(`${message}`, 400);
};

const respondDev = (err, res) => {
  const { status = "error", statusCode = 500, message, stack } = err;

  res.status(statusCode).json({
    status,
    message,
    stack,
    error: err,
  });
};

const respondProd = (err, res) => {
  const { status, statusCode, message, isOperational } = err;

  if (isOperational) {
    res.status(statusCode).json({
      status,
      message,
    });
  } else {
    console.error("ERROR 🔴");

    res.status(500).json({
      status: "error",
      message:
        "Something unexpected happened our end. Apologies for the inconvenience.",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === "development") {
    respondDev(err, res);
  }

  if (NODE_ENV === "production") {
    if (err.name === "ValidationError") {
      const { message } = err;
      err = handleValidatorError(message);
    }

    if (err.name === "JsonWebTokenError") {
      err = handleJWTError();
    }

    if (err.code === 11000) {
      const { keyValue } = err;
      const keys = Object.keys(keyValue);
      err = handleDuplicateKeyError(keys);
    }

    respondProd(err, res);
  }
};

export default globalErrorHandler;
