import User from "../models/User.js";

export const signupUser = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  const newUser = await User.create({ fullname, email, password });
  res.status(201).json({
    success: true,
    message: `New user created`,
    user: newUser
  });
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.checkPassword(password))) {
    throw Error("Invalid credentials");
  }
  res.status(200).json({
    success: true,
    message: `Connected`,
    user
  });
};

export const protect = async (req, res, next) => {
  console.log(`The protect middleware runs`);
  next();
};

export const changePassword = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: `The password is changed`
  });
};

export const getMe = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "User profile"
  });
};
