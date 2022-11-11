const Joi = require('joi');
const { password } = require('../utils/custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
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

// const getUser = {
//   params: Joi.object().keys({
//     userId: Joi.string().required(),
//   }),
// };

// const updateUser = {
//   params: Joi.object().keys({
//     userId: Joi.required(),
//   }),
//   body: Joi.object()
//     .keys({
//       email: Joi.string().email(),
//       password: Joi.string().custom(password),
//       name: Joi.string(),
//     })
//     .min(1),
// };

// const deleteUser = {
//   params: Joi.object().keys({
//     userId: Joi.string().required(),
//   }),
// };

module.exports = {
  register,
  login,
};
