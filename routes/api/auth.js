const express = require("express");
const { ctrlWrapper } = require("../../helpers");
const ctrl = require("../../controllers/authController");
const { validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");
const router = express.Router();

// signup
router.post(
  "/signup",
  validateBody(schemas.registerSchema),
  ctrlWrapper(ctrl.register)
);
// login
router.post(
  "/login",
  validateBody(schemas.loginSchema),
  ctrlWrapper(ctrl.login)
);
// google login
router.post(
  "/google/signup",
  validateBody(schemas.googleSchema),
  ctrlWrapper(ctrl.signup)
);

router.get("/logout", authenticate, ctrlWrapper(ctrl.logout));

module.exports = router;
