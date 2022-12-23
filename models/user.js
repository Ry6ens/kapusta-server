const Joi = require("joi");
const { Schema, model } = require("mongoose");

const { handleSaveErrors } = require("../helpers");

const emailRegexp =
  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set user name for user"],
      minlength: 2,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
      minlength: 6,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: emailRegexp,
    },
    accessToken: {
      type: String,
      default: "",
    },
    newUser: {
      type: Boolean,
      default: true,
    }
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveErrors);

const registerSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const googleSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  name: Joi.string().required(),
  sub: Joi.string().required(),
  aud: Joi.string().optional(),
  azp: Joi.string().optional(),
  email_verified: Joi.boolean().optional(),
  exp: Joi.number().optional(),
  family_name: Joi.string().optional(),
  given_name: Joi.string().optional(),
  iat: Joi.number().optional(),
  iss: Joi.string().optional(),
  jti: Joi.string().optional(),
  nbf: Joi.number().optional(),
  picture: Joi.string().optional(),
});

const User = model("user", userSchema);

const schemas = {
  registerSchema,
  loginSchema,
  emailSchema,
  googleSchema,
};

module.exports = {
  User,
  schemas,
};
