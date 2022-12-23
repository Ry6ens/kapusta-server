const { Transition } = require("../models/transition");
const { Balance } = require("../models/balance");
const {
  RequestError,
  monthlyData,
  convertDate,
  reportData,
} = require("../helpers");
const { schemas } = require("../models/transition");

const addNewTransition = async (req, res) => {
  const { error } = schemas.addTransitionSchema.validate(req.body);
  if (error) {
    throw RequestError(400, error.message);
  }
  const { _id: owner } = req.user;

  const result = await Transition.create({
    ...req.body,
    owner,
    reportDate: convertDate(req.body.transitionDate),
  });

  const getBalance = await Balance.findOne({ owner });
  if (req.body.transitionName === "income") {
    await Balance.findOneAndUpdate(
      { owner },
      { balance: getBalance.balance + req.body.transitionValue },
      { new: true }
    );
  } else {
    await Balance.findOneAndUpdate(
      { owner },
      { balance: getBalance.balance - req.body.transitionValue },
      { new: true }
    );
  }
  res.status(201).json(result);
};

const deleteTransition = async (req, res) => {
  const { transitionId } = req.params;
  const { _id: owner } = req.user;
  const result = await Transition.findOneAndRemove({
    _id: transitionId,
    owner,
  });

  if (!result) {
    throw RequestError(404);
  }

  const getBalance = await Balance.findOne({ owner });
  if (result.transitionName === "income") {
    await Balance.findOneAndUpdate(
      { owner },
      { balance: getBalance.balance - result.transitionValue },
      { new: true }
    );
  } else {
    await Balance.findOneAndUpdate(
      { owner },
      { balance: getBalance.balance + result.transitionValue },
      { new: true }
    );
  }

  res.status(200).json({ message: "transition deleted" });
};

const getIncomeMonthly = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Transition.find(
    { transitionName: "income", owner },
    "-createdAt -updatedAt"
  );
  if (!result) {
    throw RequestError(404, "Not found");
  }

  const incomeMonthly = monthlyData(result);
  res.json(incomeMonthly);
};

const getExpensesMonthly = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Transition.find(
    { transitionName: "expenses", owner },
    "-createdAt -updatedAt"
  );
  if (!result) {
    throw RequestError(404, "Not found");
  }

  const expensesMonthly = monthlyData(result);
  res.json(expensesMonthly);
};

const getDataByName = async (req, res) => {
  const { error } = schemas.reqDateSchema.validate(req.body);
  if (error) {
    throw RequestError(400, error.message);
  }
  const { _id: owner } = req.user;
  const result = await Transition.find(
    { reportDate: `${convertDate(req.body.reqDate)}`, owner },
    "-createdAt -updatedAt"
  );
  if (!result) {
    throw RequestError(404, "Not found");
  }

  const reqDateResult = reportData(result);
  res.json(reqDateResult.sumByName);
};

const getDataByCategoryIncome = async (req, res) => {
  const { error } = schemas.reqDateSchema.validate(req.body);
  if (error) {
    throw RequestError(400, error.message);
  }
  const { _id: owner } = req.user;
  const result = await Transition.find(
    {
      reportDate: `${convertDate(req.body.reqDate)}`,
      owner,
      transitionName: "income",
    },
    "-createdAt -updatedAt"
  );
  if (!result) {
    throw RequestError(404, "Not found");
  }

  const reqDateResult = reportData(result);
  res.json(reqDateResult.sumByCategory);
};

const getDataByCategoryExpenses = async (req, res) => {
  const { error } = schemas.reqDateSchema.validate(req.body);
  if (error) {
    throw RequestError(400, error.message);
  }
  const { _id: owner } = req.user;
  const result = await Transition.find(
    {
      reportDate: `${convertDate(req.body.reqDate)}`,
      owner,
      transitionName: "expenses",
    },
    "-createdAt -updatedAt"
  );
  if (!result) {
    throw RequestError(404, "Not found");
  }

  const reqDateResult = reportData(result);
  res.json(reqDateResult.sumByCategory);
};

const getDataByCategoryIncomeDateil = async (req, res) => {
  const { error } = schemas.reqDateAndCategorySchema.validate(req.body);
  if (error) {
    throw RequestError(400, error.message);
  }
  const { _id: owner } = req.user;
  let transitionCategory = "Salary";
  if (req.body.transitionCategory !== "") {
    transitionCategory = req.body.transitionCategory;
  }
  const result = await Transition.find(
    {
      reportDate: `${convertDate(req.body.reqDate)}`,
      owner,
      transitionCategory: transitionCategory,
      transitionName: "income",
    },
    "-createdAt -updatedAt"
  );
  if (!result) {
    throw RequestError(404, "Not found");
  }

  const reqDateResult = reportData(result);
  res.json(reqDateResult.sumByDescription);
};

const getDataByCategoryExpensesDateil = async (req, res) => {
  const { error } = schemas.reqDateAndCategorySchema.validate(req.body);
  if (error) {
    throw RequestError(400, error.message);
  }
  const { _id: owner } = req.user;
  let transitionCategory = "Products";
  if (req.body.transitionCategory !== "") {
    transitionCategory = req.body.transitionCategory;
  }
  const result = await Transition.find(
    {
      reportDate: `${convertDate(req.body.reqDate)}`,
      owner,
      transitionCategory: transitionCategory,
      transitionName: "expenses",
    },
    "-createdAt -updatedAt"
  );
  if (!result) {
    throw RequestError(404, "Not found");
  }

  const reqDateResult = reportData(result);
  res.json(reqDateResult.sumByDescription);
};

const getTimeLineData = async (req, res) => {
  console.log(req.body);
  const { error } = schemas.reqDateSchema.validate(req.body);
  if (error) {
    throw RequestError(400, error.message);
  }
  const { _id: owner } = req.user;
  const userTransitions = await Transition.find(
    { reportDate: `${convertDate(req.body.reqDate)}`, owner },
    "-createdAt -updatedAt"
  );
  const userBalance = await Balance.find({ owner });
  if (!userTransitions || !userBalance) {
    throw RequestError(404, "Not found");
  }
  const result = {
    balance: userBalance[0].balance,
    transitions: userTransitions,
  };
  res.json(result);
};

module.exports = {
  addNewTransition,
  deleteTransition,
  getIncomeMonthly,
  getExpensesMonthly,
  getDataByName,
  getDataByCategoryIncome,
  getDataByCategoryExpenses,
  getDataByCategoryIncomeDateil,
  getDataByCategoryExpensesDateil,
  getTimeLineData,
};
