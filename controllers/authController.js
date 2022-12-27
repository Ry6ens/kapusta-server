const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

const { Balance } = require("../models/balance");
const { User } = require("../models/user");
const { SECRET_KEY } = process.env;

const { RequestError, updateNewAvatar } = require("../helpers");

const register = async (req, res) => {
  const { username, email, password, name } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw RequestError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    username,
    email,
    password: hashPassword,
    name,
    avatarURL,
  });

  const owner = newUser._id;

  await Balance.create({ owner });

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
      newUser: newUser.newUser,
      avatarURL: newUser.avatarURL,
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
  await User.findByIdAndUpdate(user._id, { accessToken, newUser: false });

  res.json({
    accessToken,
    user: {
      email: user.email,
      name: user.name,
      newUser: user.newUser,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { accessToken: "" });

  res.status(204).json({ message: "logout success" });
};

const googleSignup = async (req, res) => {
  const { email, sub, name, picture } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const owner = user.id;
    const paylaod = {
      id: owner,
    };
    const accessToken = jwt.sign(paylaod, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(owner, { accessToken, newUser: false });
    res.json({
      accessToken: accessToken,
      user: {
        email: user.email,
        name: user.name,
        newUser: user.newUser,
        
      },
    });
  } else {
    const hashPassword = await bcrypt.hash(sub, 10);
    const avatarURL = picture;
    const newUser = await User.create({ email, password: hashPassword, name, avatarURL });
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
        newUser: newUser.newUser,
        avatarURL: newUser.avatarURL,
      },
    });
  }
};

const updateUserController = async (req, res) => {
  const { _id: owner } = req.user;

  const { date, month, year, sex, email, file, firstName, lastName,} = req.body;

  const newAvatar = updateNewAvatar(file, owner);
  console.log(newAvatar)

  const result = await User.findByIdAndUpdate(owner, { firstName: firstName, lastName: lastName, gender: sex, dateBirth: date, monthBirth: month, yearBirth: year, email: email }, {new: true});

  res.status(200).json(result);
};

module.exports = {
  register,
  login,
  logout,
  googleSignup,
  updateUserController,
};
