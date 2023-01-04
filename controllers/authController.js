const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

const Jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");

const { Balance } = require("../models/balance");
const { User } = require("../models/user");
const { Session } = require("../models/session");
const { SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const { RequestError, checkData } = require("../helpers");

const register = async (req, res) => {
  const { username, email, password, firstName } = req.body;

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
    firstName,
    avatarURL,
  });

  const owner = newUser._id;

  await Balance.create({ owner });

  res.status(201).json({
    user: {
      firstName: newUser.name,
      email: newUser.email,
      newUser: newUser.newUser,
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

  const accessToken = jwt.sign(paylaod, SECRET_KEY, { expiresIn: "30m" });
  const refreshToken = jwt.sign(paylaod, REFRESH_SECRET_KEY, { expiresIn: "23h" });
  
  const newSession = await Session.create({
    uid: user._id,
  });

    const result = await User.findByIdAndUpdate(
      user._id,
      { accessToken, refreshToken, sid: newSession.id, newUser: false },
      { new: true }
    );

  res.json(result);
};

const refreshAccesToken = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, refreshToken] = authorization.split(" ");
    if (bearer !== "Bearer") {
      return res.status(401).send({ message: "No token provided" });
    } else {
      const activeSession = await Session.findById(req.body.sid);
      if (!activeSession) {
        return res.status(404).send({ message: "Invalid session" });
      }

      let payload = "";
      try {
        payload = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
      } catch (error) {
          await Session.findByIdAndDelete(req.body.sid);
          return res.status(401).send({ message: "Unauthorized" });
      }

      const user = await User.findById(payload.id);
      const session = await Session.findById(req.body.sid);

      if (!user) {
        return res.status(404).send({ message: "Invalid user" });
      }
      if (!session) {
        return res.status(404).send({ message: "Invalid session" });
      }

      await Session.findByIdAndDelete(req.body.sid);

      const paylaod = {id: user._id,};
      const newSession = await Session.create({uid: user._id});
      const newAccessToken = jwt.sign(paylaod, SECRET_KEY, { expiresIn: "30m" });
      const newRefreshToken = jwt.sign(paylaod, REFRESH_SECRET_KEY, { expiresIn: "23h" });

      await User.findByIdAndUpdate(
        user._id,
        { accessToken: newAccessToken, refreshToken: newAccessToken, sid: newSession._id},
        { new: true }
      );

    return res
      .status(200)
      .send({ newAccessToken, newRefreshToken, sid: newSession._id });
    }
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { accessToken: "", refreshToken: "", sid: "" });
  await Session.findOneAndDelete({uid: _id});

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

    const accessToken = jwt.sign(paylaod, SECRET_KEY, { expiresIn: "30m" });
    const refreshToken = jwt.sign(paylaod, REFRESH_SECRET_KEY, { expiresIn: "23h" });

    const newSession = await Session.create({
      uid: user._id,
    });
  
      const result = await User.findByIdAndUpdate(
        user._id,
        { accessToken, refreshToken, sid: newSession.id, newUser: false },
        { new: true }
      );

    res.json(result);

  } else {
    const hashPassword = await bcrypt.hash(sub, 10);
    const avatarURL = picture;
    const newUser = await User.create({
      email,
      password: hashPassword,
      firstName: name,
      avatarURL,
    });

    const owner = newUser._id;
    await Balance.create({ owner });
    const paylaod = {
      id: owner,
    };
    const accessToken = jwt.sign(paylaod, SECRET_KEY, { expiresIn: "30m" });
    const refreshToken = jwt.sign(paylaod, REFRESH_SECRET_KEY, { expiresIn: "23h" });

    const newSession = await Session.create({
      uid: user._id,
    });
  
      const result = await User.findByIdAndUpdate(
        user._id,
        { accessToken, refreshToken, sid: newSession.id, newUser: false },
        { new: true }
      );

    res.json(result);
  }
};

const avatarsDir = path.join(__dirname, "../", "public", "avatars");
const updateUserController = async (req, res) => {
  const { _id: owner } = req.user;
  const user = await User.findOne(owner);

  const { date, month, year, sex, email, firstName, lastName } = req.body;

  const avatar = req.file;
  if (avatar) {
    const { path: tempUpload, originalname } = req.file;
    const filename = `${owner}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);

    const resizeAvatar = await Jimp.read(resultUpload);
    await resizeAvatar.resize(250, 250).write(resultUpload);

    const production = "https://kapusta-server.herokuapp.com";
    const development = "http://localhost:4000";
    const url =
      process.env.NODE_ENV === "development" ? development : production;

    const avatarURL = `${url}/static/avatars/${filename}`;
    const result = await User.findByIdAndUpdate(
      owner,
      {
        firstName: checkData(firstName, user.firstName),
        lastName: checkData(lastName, user.lastName),
        gender: checkData(sex, user.gender),
        dateBirth: checkData(date, user.date),
        monthBirth: checkData(month, user.month),
        yearBirth: checkData(year, user.year),
        email: checkData(email, user.email),
        avatarURL: avatarURL,
      },
      { new: true }
    );

    res.status(200).json(result);
  } else {
    const result = await User.findByIdAndUpdate(
      owner,
      {
        firstName: checkData(firstName, user.firstName),
        lastName: checkData(lastName, user.lastName),
        gender: checkData(sex, user.gender),
        dateBirth: checkData(date, user.date),
        monthBirth: checkData(month, user.month),
        yearBirth: checkData(year, user.year),
        email: checkData(email, user.email),
      },
      { new: true }
    );

    res.status(200).json(result);
  }
};

const deleteUserController = async (req, res) => {
  const { userId } = req.params;
  await User.findOneAndDelete({ _id: userId });
  await Session.findOneAndDelete({uid: userId});
  res.status(200).json({ message: "user deleted" });
};

module.exports = {
  register,
  login,
  logout,
  googleSignup,
  updateUserController,
  deleteUserController,
  refreshAccesToken,
};
