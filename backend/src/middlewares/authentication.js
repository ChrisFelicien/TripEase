import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

const createTokenSendResponse = (user, res, statusCode) => {
  // Send token via cookie only
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m"
  });

  res.cookie("token", token, {
    maxAge: 15 * 60 * 1000,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true
  });
  // remove the password from the response
  user.password = undefined;

  // Send response
  res.status(statusCode).json({
    success: true,
    user
  });
};

export const signupUser = asyncHandler(async (req, res, next) => {
  const { fullname, email, password } = req.body;
  const newUser = await User.create({ fullname, email, password });

  createTokenSendResponse(newUser, res, 201);
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.checkPassword(password))) {
    throw Error("Invalid credentials");
  }

  createTokenSendResponse(user, res, 200);
});

export const protect = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return next(new AppError(`No token please login`, 400));
    }

    // decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(new AppError(`User no longer exist`, 401));
    }

    //  check if the password has not been modified
    if (user.changedPasswordAfter && user.changedPasswordAfter(decoded.iat)) {
      return next(new AppError(`Password changed recently, Please login`, 401));
    }
    req.user = user;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token", 401));
    }

    if (error.name === "TokenExpiredError") {
      return next(new AppError(`Token expired, Please login again`, 401));
    }
  }
};

export const changePassword = asyncHandler(async (req, res, next) => {
  const { password, newPassword, confirmNewPassword } = req.body;
  if (!password || !newPassword || !confirmNewPassword) {
    return next(new AppError("All fields are required", 400));
  }
  if (password === newPassword) {
    return next(
      new AppError("You can not use the current password has new password", 400)
    );
  }
  if (newPassword !== confirmNewPassword) {
    return next(
      new AppError(
        "The new password and the confirm password should match",
        400
      )
    );
  }
  // get current user
  const user = await User.findById(req.user._id);

  console.log(await user.checkPassword(password));

  if (!(await user.checkPassword(password))) {
    return next(new AppError("Please provide the valid password", 400));
  }

  user.password = newPassword;
  user.passwordChangedAt = Date.now();
  await user.save();

  res.status(200).json({
    success: true,
    message: `The password is changed`
  });
});

export const getMe = asyncHandler(async (req, res, next) => {
  const user = req.user;
  user.password = undefined;
  res.status(200).json({
    success: true,

    user
  });
});
