const express = require("express");
const { ctrlWrapper } = require("../../helpers");
const {authenticate, upload} = require("../../middlewares")

const ctrl = require("../../controllers/avatarsController")

const router = express.Router();

router.patch("/update", authenticate, upload.single("avatar"), ctrlWrapper(ctrl.updateAvatar))

module.exports = router;
