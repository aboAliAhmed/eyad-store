import AppError from "../utils/appError.js";

const handleCastErrorDB = (err) => {
  const message = ` ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${Object.keys(
    err.keyValue
  )}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError(`You've got invailed token, please login!`, 401);

const handleJWTExpiredError = () =>
  new AppError("Your token have been expired, please login!", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Porgraming or other unknown error: don't leak error details
  } else {
    res.status(500).json({
      error: err,
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    const errName = err.name;
    if (errName === "CastError") {
      error = handleCastErrorDB(error);
      sendErrorProd(error, res);
    } else if (err.code === 11000) {
      error = handleDuplicateFieldsDB(error);
      sendErrorProd(error, res);
    } else if (errName === "ValidationError") {
      error = handleValidationErrorDB(error);
      sendErrorProd(error, res);
    } else if (errName === "JsonWebTokenError") {
      error = handleJWTError();
      sendErrorProd(error, res);
    } else if (errName === "TokenExpiredError") {
      error = handleJWTExpiredError();
      sendErrorProd(error, res);
    } else {
      sendErrorProd(err, res);
    }
  }
};

export default globalErrorHandler;
