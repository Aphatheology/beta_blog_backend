const Joi = require("joi");
const { objectId } = require("../utils/custom.validation");

const createArticle = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        body: Joi.string().required(),
        description: Joi.string(),
        tags: Joi.string(),
    }),
};

module.exports = {
    createArticle,
};
