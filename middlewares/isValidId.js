const {isValidObjectId} = require("mongoose");

const {RequestError} = require("../helpers");

const isValidId = (req, res, next) => {
    const {transitionId} = req.params;
    if(!isValidObjectId(transitionId)) {
        next(RequestError(400, `${transitionId} is not valid id format`))
    }
    next();
}

module.exports = isValidId;