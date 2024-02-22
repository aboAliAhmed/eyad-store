import AppError from "../utils/appError.js";

const handleCastErrorDB = (err) => {
  const message = ` ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `${
    Object.keys(err.keyValue)[0] === "username"
      ? "إسم المستخدم"
      : "البريد الإلكتروني"
  } موجود بالفعل, اختر قيمة أخرى`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError(`الشفرة الخاصة بك غير صالحة, منفضل قم بستسجيل الدخول`, 401);

const handleJWTExpiredError = () => new AppError("أنت بحاجة لتسجل الدخول", 401);

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
      message: "شيئٌ ما ليس على ما يرام!",
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
