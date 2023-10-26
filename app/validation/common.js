const Joi = require('joi');
const { PASSWORD } = require('../constant/auth');

const pass = Joi.string().regex(PASSWORD.REGEXP).message(PASSWORD.MSG).min(PASSWORD.MINCHAR).max(PASSWORD.MAXCHAR).required();

const username = Joi.string().trim().required();

module.exports = { pass, username };
