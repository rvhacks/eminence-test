const ERROR_MSG = {
  EXPIRED: 'jwt expired',
  INVALID: 'invalid signature'
};

const PASSWORD = {
  REGEXP: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  MSG: 'Password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
  MINCHAR: 8,
  MAXCHAR: 20
};

module.exports = { ERROR_MSG, PASSWORD };
