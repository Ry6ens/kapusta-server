const jwt = require("jsonwebtoken");
const { RequestError } = require("../helpers");

const { User } = require("../models/user");

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  console.log(authorization);
  const [bearer, token] = authorization.split(" ");
  console.log(token);
  if (bearer !== "Bearer") {
    next(RequestError(401));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    console.log(id);
    const user = await User.findById(id);
    console.log(user);
    if (!user || !user.accessToken) {
      console.log("!user || !user.accessToken");
      next(RequestError(401));
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    next(RequestError(401, error.message));
  }
};

module.exports = authenticate;
