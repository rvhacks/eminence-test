const response = require('../response');
const authJwt = require('../middleware');
const httpStatus = require('http-status');
const helper = require('../utils/helper');
const { Auth } = require('../model');
const commonService = require('../services/common');
const { env } = require('../constant/environment');

exports.isUserExist = async (req, res, next) => {
  try {
    const { username } = req.body;
    const condition = { username: username.toLowerCase() };
    const checkUserExist = await commonService.getByCondition(Auth, condition);
    if (checkUserExist) {
      return response.error(req, res, { msgCode: 'ERR0003' }, httpStatus.CONFLICT);
    }
    return next();
  } catch (err) {
    return response.error(req, res, { msgCode: 'ERR0001' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const data = { username, password: helper.generateHash(password) };
    const createUser = await commonService.create(Auth, data);
    if (!createUser) {
      return response.error(req, res, { msgCode: 'ERR0004' }, httpStatus.FORBIDDEN);
    }
    const result = { username: createUser.username };
    return response.success(req, res, { msgCode: 'SCC0002', data: result }, httpStatus.CREATED);
  } catch (err) {
    return response.error(req, res, { msgCode: 'ERR0001' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

exports.login = async (req, res) => {
  try {
    const { username } = req.body;
    const condition = { username };
    const checkUser = await commonService.getByCondition(Auth, condition);
    if (!checkUser) {
      return response.error(req, res, { msgCode: 'ERR0005' }, httpStatus.UNAUTHORIZED);
    }
    const isLogin = helper.comparePassword(req.body.password, checkUser.password);
    if (!isLogin) {
      return response.error(req, res, { msgCode: 'ERR0005' }, httpStatus.UNAUTHORIZED);
    }
    const { password, jwtToken, ...resultData } = checkUser;
    resultData.token = authJwt.generateAuthJwt({
      id: checkUser._id,
      expireIn: env.TOKEN_EXPIRES_IN,
      username
    });
    if (!resultData.token) {
      return response.error(req, res, { msgCode: 'ERR0004' }, httpStatus.FORBIDDEN);
    }
    const createSession = await commonService.updateByCondition(Auth, { _id: checkUser._id }, { jwtToken: resultData.token });
    if (!createSession) {
      return response.error(req, res, { msgCode: 'ERR0004' }, httpStatus.FORBIDDEN);
    }
    return response.success(req, res, { msgCode: 'SCC0003', data: resultData }, httpStatus.OK);
  } catch (err) {
    return response.error(req, res, { msgCode: 'ERR0001' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

exports.logout = async (req, res) => {
  try {
    const condition = { _id: req.data.id };
    const destroySession = await commonService.updateByCondition(Auth, condition, { jwtToken: '' });
    if (!destroySession) {
      return response.error(req, res, { msgCode: 'ERR0004' }, httpStatus.FORBIDDEN);
    }
    return response.success(req, res, { msgCode: 'SCC0004' }, httpStatus.OK);
  } catch (err) {
    return response.error(req, res, { msgCode: 'ERR0001' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
};
