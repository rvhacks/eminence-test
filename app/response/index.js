const httpStatus = require('http-status');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const { DEFAULT_CODES } = require('../constant/common');

const lngMsg = {};
fs.readdirSync(path.join(__dirname, 'lng')).filter(file => {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-5) === '.json');
}).forEach(file => {
  const fileName = file.slice(0, -5);
  const lng = require(path.join(__dirname, 'lng', file));
  lngMsg[fileName] = lng;
});

exports.success = (req, res, result, code) => {
  const lng = req.headers['accept-language'] || 'en';
  try {
    const response = {
      success: true,
      code: result.msgCode,
      message: lngMsg[lng]?.SUCCESS[result.msgCode] || httpStatus[code],
      result: result.data || {}
    };
    return res.status(code).json(response);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      {
        success: false,
        code: DEFAULT_CODES.ERROR,
        message: lngMsg[lng]?.ERROR[DEFAULT_CODES.ERROR],
        result: {}
      });
  }
};

exports.error = (req, res, error, code) => {
  const lng = req.headers['accept-language'] || 'en';
  try {
    const response = {
      success: false,
      code: error.msgCode,
      message: lngMsg[lng]?.ERROR[error.msgCode] || error.msg || httpStatus[code],
      result: {
        error: error.data || {}
      }
    };
    res.status(code).json(response);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      code: DEFAULT_CODES.ERROR,
      message: lngMsg[lng]?.ERROR[DEFAULT_CODES.ERROR],
      result: {}
    });
  }
};
