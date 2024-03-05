import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  allowedFields.forEach((field) => {
    if (allowedFields.includes(field) && obj[field]) {
      newObj[field] = obj[field];
    }
  });
  return newObj;
};

// Sending the response to the server
const sendResponse = (res, user, statusCode) => {
  res.status(statusCode).json({
    status: "success",
    data: {
      user,
    },
  });
};

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    result: users.length,
    data: users,
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Make sure that the request has no password data
  if (req.body.passwords) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updatePassword.",
        400
      )
    );
  }

  // 2) Filter out fields that are not wanted to be updated
  const filteredBody = filterObj(
    req.body,
    "username",
    "email",
    "phone",
    "country",
    "government",
    "city",
    "streetAndAppartmentNo"
  );
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  sendResponse(res, updatedUser, 200);
});

export const createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  sendResponse(res, user, 201);
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("No user found with this id"));
  }

  sendResponse(res, user, 200);
});

export const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!user) {
    return next(new AppError("No user foud with this id"));
  }
  sendResponse(res, user, 200);
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError("No user foud with this id"));
  }

  res.status(204).json({
    status: "deleted",
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
