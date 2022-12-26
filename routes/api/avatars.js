const express = require("express");
const { ctrlWrapper } = require("../../helpers");
const {authenticate} = require("../../middlewares")

const ctrl = require("../../controllers/avatarsController")

const router = express.Router();

router.post("/update", authenticate, ctrlWrapper(ctrl.uploadAvatar))

module.exports = router;
