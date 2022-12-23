const { Balance } = require("../models/balance");
const { RequestError } = require("../helpers");
const { schemas } = require("../models/balance");

const addNewBalance = async (req, res) => {
  const { error } = schemas.addBalanceSchema.validate(req.body);
  if (error) {
    throw RequestError(400, error.message);
  }
  const { _id: owner } = req.user;

  const result = await Balance.findOneAndUpdate(
    { owner },
    { balance: req.body.newBalance },
    { new: true }
  );
  res.status(201).json({ newBalance: result.balance });
};

const getBalance = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Balance.findOne({ owner });
  res.status(201).json({ balance: result.balance });
};

module.exports = {
  addNewBalance,
  getBalance,
};
