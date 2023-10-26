const response = require('../response');
const httpStatus = require('http-status');

const reqValidator = (schema, source = 'body') => async (req, res, next) => {
  const data = req[source];
  try {
    if (req.files && Object.entries(req.files).length !== 0 && req.files.constructor !== Object) {
      for (const [key, value] of Object.entries(data)) {
        if (typeof (value) === 'string') data[key] = JSON.parse(value);
      }
    }
    const validatedValues = await schema.validate(data, {
      abortEarly: true, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true // remove unknown props
    });
    if (validatedValues.error) {
      const { details } = validatedValues.error;
      const message = details.map((i) => i.message).join(',');
      return response.error(req, res, { msgCode: 'ERROR', msg: message }, httpStatus.BAD_REQUEST);
    }
    req[source] = validatedValues.value;
  } catch (err) {
    return response.error(req, res, { msgCode: 'ERR0001' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
  return next();
};

module.exports = { reqValidator };
