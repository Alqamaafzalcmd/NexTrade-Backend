Joi = require("joi");


const userSchemaValidation = Joi.object({
     username: Joi.string().required(),
     email:Joi.string().required(),
     password: Joi.string().required()
});

const userLoginValidation = Joi.object({
    username_email:Joi.string.required(),
    password:Joi.string().required()
})

module.exports = {userSchemaValidation, userLoginValidation};