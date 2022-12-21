const {Balance} = require("../models/balance");
const {RequestError} = require("../helpers");
const {schemas} = require("../models/balance");

const addNewBalance = async(req, res)=> {
    const {error} = schemas.addBalanceSchema.validate(req.body);
        if(error) {
            throw RequestError(400, error.message)
        }
    const {_id: owner} = req.user;
    
    const result = await Balance.findOneAndUpdate({owner}, {balanceValue: req.body.balanceValue}, {new: true});
    res.status(201).json({balanceValue: result.balanceValue})
}

const getBalance = async(req, res)=> {
    const {_id: owner} = req.user;
    
    const result = await Balance.findOne({owner});
    res.status(201).json({balanceValue: result.balanceValue})
}

module.exports = {
    addNewBalance,
    getBalance,
}