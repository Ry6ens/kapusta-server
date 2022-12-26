const express = require("express");
const { ctrlWrapper } = require("../../helpers");
const ctrl = require("../../controllers/authController");
const { validateBody, authenticate, isValidId } = require("../../middlewares");
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
  ctrlWrapper(ctrl.googleSignup)
);

router.get("/logout", authenticate, ctrlWrapper(ctrl.logout));

router.patch("/update", authenticate, validateBody(schemas.updateUserSchema), ctrlWrapper(ctrl.updateUserController));

module.exports = router;
