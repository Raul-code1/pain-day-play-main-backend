const { StatusCodes } = require("http-status-codes");

const User = require("../models/User");
const CustomError = require("../errors");
const { createToken } = require("../utils");

/* Register controller  */
const register = async (req, res) => {
  const { email } = req.body;

  const isEmailExist = await User.findOne({ email });
  if (isEmailExist)
    throw new CustomError.BadRequestError("Email already exists");

  const isFirstUser = (await User.countDocuments({})) === 0;
  const role = isFirstUser ? "admin" : "user";
  req.body.role = role;

  const user = await User.create(req.body);

  /* Jwt  */
  const tokenUser = { userId: user._id, name: user.name, role: user.role };
  const token=createToken({payload:tokenUser});

  /* Response  */
  res.status(StatusCodes.CREATED).json({ user:tokenUser,token });
};




/* Login controller */
const login = async (req, res) => {
  const{email,password} = req.body;
  if (!email || !password)throw new CustomError.BadRequestError('Please provide all the values')

  const user = await User.findOne({email})
  if (!user) throw new CustomError.NotFoundError('Email does not exist');

  const isPasswordCorrect= await user.comparePassword(password)
  if (!isPasswordCorrect) throw new CustomError.UnauthenticatedError('Invalid password');

  const tokenUser={userId:user._id,name:user.name,role:user.role};
  const token=createToken({payload:tokenUser});

  res.status(StatusCodes.OK).json({user:tokenUser,token});
};




module.exports = {
  register,
  login,
};
