const jwt = require('jsonwebtoken');
const response = require('../response');
const httpStatus = require('http-status');
const commonService = require('../services/common');
const { Auth } = require('../model');
const { env } = require('../constant/environment');
const { ERROR_MSG } = require('../constant/auth');

// This function is used for generate jwt token
exports.generateAuthJwt = (payload) => {
  const { expireIn, ...params } = payload;
  const token = jwt.sign(params, env.SECRET_KEY, { expiresIn: expireIn });
  if (!token) {
    return false;
  }
  return token;
};

exports.verifyAuthToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return response.error(req, res, { msgCode: 'ERR0007' }, httpStatus.UNAUTHORIZED);
    }
    token = token.replace(/^Bearer\s+/, '');
    jwt.verify(token, env.SECRET_KEY, async (error, decoded) => {
      if (error) {
        let msgCode = 'ERR0006';
        if (error.message === ERROR_MSG.EXPIRED) {
          msgCode = 'ERR0008';
        }
        return response.error(req, res, { msgCode }, httpStatus.UNAUTHORIZED);
      }
      const condition = { jwtToken: token };
      const checkJwt = await commonService.getByCondition(Auth, condition);
      if (!checkJwt) {
        return response.error(req, res, { msgCode: 'ERR0006' }, httpStatus.UNAUTHORIZED);
      } else {
        req.data = decoded;
        return next();
      }
    });
  } catch (err) {
    return response.error(req, res, { msgCode: 'ERR0001' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
};
