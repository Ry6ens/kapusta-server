const express = require("express");
const { ctrlWrapper } = require("../../helpers");
const {isValidId, authenticate} = require("../../middlewares")

const ctrl = require("../../controllers/transitionsController")

const router = express.Router();

router.post("/", authenticate, ctrlWrapper(ctrl.addNewTransition))

router.get("/income/monthly", authenticate, ctrlWrapper(ctrl.getIncomeMonthly))

router.get("/expenses/monthly", authenticate, ctrlWrapper(ctrl.getExpensesMonthly))

router.delete("/delete/:transitionId", authenticate, isValidId, ctrlWrapper(ctrl.deleteTransition))

router.get("/report/category", authenticate, ctrlWrapper(ctrl.getDataByName))

router.get("/report/category/income", authenticate, ctrlWrapper(ctrl.getDataByCategoryIncome))

router.get("/report/category/income/dateil", authenticate, ctrlWrapper(ctrl.getDataByCategoryIncomeDateil))

router.get("/report/category/expenses", authenticate, ctrlWrapper(ctrl.getDataByCategoryExpenses))

router.get("/report/category/expenses/dateil", authenticate, ctrlWrapper(ctrl.getDataByCategoryExpensesDateil))

module.exports = router;