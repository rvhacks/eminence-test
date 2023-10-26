const Joi = require('joi');

const productByCategory = Joi.object({
  categoryName: Joi.string().trim().min(1).required()
});

module.exports = { productByCategory };
