const express = require("express");
const { ctrlWrapper } = require("../../helpers");
const {authenticate} = require("../../middlewares")

const ctrl = require("../../controllers/balancesController")

const router = express.Router();

router.post("/update", authenticate, ctrlWrapper(ctrl.addNewBalance))

router.get("/", authenticate, ctrlWrapper(ctrl.getBalance))

module.exports = router;