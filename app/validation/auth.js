const Joi = require('joi');
const { username, pass } = require('./common');

const login = Joi.object({
  username,
  password: Joi.string().required()
});

const register = Joi.object({
  username,
  password: pass
});

module.exports = { login, register };
