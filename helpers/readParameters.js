const fs = require('fs').promises;
const path = require('path');

const expensesPath = path.resolve("./db/parameters/expenses.json");
const incomePath = path.resolve("./db/parameters/income.json")


const readParameters = async (data) => {
    let result = [];
        if(data === "expenses") {
            const dataList = await fs.readFile(expensesPath);
            result = JSON.parse(dataList);
        } if(data === "income") {
            const dataList = await fs.readFile(incomePath);
            result = JSON.parse(dataList);
        } if(data === "") {
            const expensesList = await fs.readFile(expensesPath);
            const expensesResult = JSON.parse(expensesList);
            const incomeList = await fs.readFile(incomePath);
            const incomeResult = JSON.parse(incomeList);
            const dataList = expensesResult.concat(incomeResult);
            result = dataList;
        }
        return result;
    } 

module.exports = readParameters;