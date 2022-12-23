const Joi = require("joi");
const {Schema, model} = require('mongoose');

const {handleSaveErrors} = require("../helpers");

const transitionName = ['income', 'expenses'];
const transitionCategory = ['', 'Products', 'Alcohol', 'Entertainment', 'Health', 'Transport', 'Housing', 'Technique', 'Communal, communication', 'Sports, hobbies', 'Education', 'Other', 'Salary', 'Add. income']

const transitionSchema = new Schema({
    transitionName: {
        type: String,
        required: [true, 'Set transition name'],
        enum: transitionName,
    },
    transitionDate: {
        type: String,
        required: [true, 'Set transition date'],
    },
    reportDate: {
        type: String,
        default: "",
    },
    transitionCategory: {
        type: String,
        required: [true, 'Set transition category'],
    },
    transitionValue: {
        type: Number,
        required: [true, 'Set transition sum'],
    },
    transitionDescription: {
        type: String,
        required: [true, 'Set transition description'],
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
}, {versionKey: false, timestamps: true});

transitionSchema.post('save', handleSaveErrors);

const addTransitionSchema = Joi.object({
    transitionName: Joi.string()
            .valid(...transitionName)
            .required(),
    transitionDate: Joi.string()
            .required(),
    transitionCategory: Joi.string()
            .required(),
    transitionValue: Joi.number()
            .required(),
    transitionDescription: Joi.string()
            .required(),
})

const reqDateSchema = Joi.object({
    reqDate: Joi.string()
            .required(),
});

const reqDateAndCategorySchema = Joi.object({
    reqDate: Joi.string()
            .required(),
    transitionCategory: Joi.string()
            .valid(...transitionCategory)
            .required(),

});

const schemas = {
    addTransitionSchema,
    reqDateSchema,
    reqDateAndCategorySchema,
}

const Transition = model('transition', transitionSchema);

module.exports = {
    Transition,
    schemas,
};