const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Balance } = require("../models/balance");

const { User } = require("../models/user");
const { SECRET_KEY } = process.env;

const { RequestError } = require("../helpers");

const register = async (req, res) => {
  const { username, email, password, name } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw RequestError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashPassword,
    name,
  });

  const owner = newUser._id;

  await Balance.create({ owner });

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw RequestError(401, "Invalid email or password");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw RequestError(401, "Invalid email or password");
  }

  const paylaod = {
    id: user._id,
  };

  const accessToken = jwt.sign(paylaod, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { accessToken });

  res.json({
    accessToken,
    user: {
      email: user.email,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { accessToken: "" });

  res.status(204).json({ message: "logout success" });
};

const signup = async (req, res) => {
  const { email, sub, name } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw RequestError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(sub, 10);
  const newUser = await User.create({ email, password: hashPassword, name });
  const owner = newUser._id;
  await Balance.create({ owner });
  const paylaod = {
    id: owner,
  };
  const accessToken = jwt.sign(paylaod, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(owner, { accessToken });
  res.json({
    accessToken: accessToken,
    user: {
      email: newUser.email,
      name: newUser.name,
    },
  });
};

module.exports = {
  register,
  login,
  logout,
  signup,
};
