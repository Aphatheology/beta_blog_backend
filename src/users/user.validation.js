const Joi = require("joi");
const { password } = require("../utils/custom.validation");

const register = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        username: Joi.string().required(),
        password: Joi.string().required().custom(password),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
    }),
};

const login = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
    }),
};

const createUser = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        username: Joi.string().required(),
        password: Joi.string().custom(password),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
    }),
};

const getUser = {
    params: Joi.object().keys({
        username: Joi.string().required(),
    })
}

const updateUser = {
    params: Joi.object().keys({
        username: Joi.string().required(),
    }),
    body: Joi.object().keys({
        firstname: Joi.string(),
        lastname: Joi.string(),
    }).min(1),
};

module.exports = {
    register,
    login,
    getUser,
    createUser,
    updateUser
};
