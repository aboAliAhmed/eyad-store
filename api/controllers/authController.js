import User from "../models/userModel.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import sendEmail from "../utils/email.js";
import crypto from "crypto";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  await newUser.save();
  createSendToken(newUser, 201, res);
  next();
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("أدخل اسم المستحدم وكلمة السر", 401));

  const user = await User.findOne({ email }).select("+password");
  if (!user)
    return next(new AppError("هذا الحساب غير مسجل لدينا, يمكنك التسجيل", 401));

  if (!(await user.correctPassword(password, user.password)))
    return next(new AppError("كلمة لاسر مختلفة", 401));

  createSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
  // 1) Get the Token
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.headers.cookie) {
    token = req.headers.cookie.slice(4);
  }
  if (!token) {
    return next(new AppError("من فضلك قم بتسجيل الدخول"));
  }

  // 2) Verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // compare the secret of the token with the stored secret

  // 3) check if user still exists
  const existedUser = await User.findById(decoded.id);
  if (!existedUser) {
    return next(new AppError("this user is no longer existed", 401));
  }

  // 4) check if user changed password
  if (existedUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password, please login", 401)
    );
  }
  req.user = existedUser; // Grant the user his data and Access to protected route
  console.log(req.user);
  console.log(req.user.role);
  next();
});

export const restrictTo = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(roles, req.user.role, req.user);
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

export const google = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    createSendToken(user, 200, res);
  } else {
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8); // It results the last 8 digits of a number like (0.5sfs6asds7r) so we got a 16 digits
    const newUser = new User({
      username:
        req.body.name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4),
      email: req.body.email,
      password: generatedPassword,
      avatar: req.body.imageUrl,
    });
    await newUser.save();
    createSendToken(newUser, 200, res);
  }
});

export const logout = catchAsync(async (req, res, next) => {
  res.clearCookie("jwt");
  res.status(200).json("User has been logged out!");
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Go to ${resetURL}, if you do not forgot it ignore the message`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset token, valid for 10 minutes",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save({ validateBeforeSave: false });
    return next(
      new AppError("There was an error sending the email. Try again later!")
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) If user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) check if token is true and has not expired, set the new password

  if (!user) {
    return next(
      new AppError(`Your token has expired or you've entered an invalid token `)
    );
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) update changedPasswordaAt property
  // 4) login and send JWT
  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if posted current password is correct

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) Update password
  user.password = req.body.password;
  await user.save();

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
