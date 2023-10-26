const bcrypt = require('bcrypt');
const axios = require('axios');
const { env } = require('../constant/environment');
let saltRounds = env.SALT_ROUND;

exports.generateHash = (password) => {
  try {
    saltRounds = parseInt(saltRounds);
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password.toString(), salt);
    return hash;
  } catch (err) {
    return false;
  }
};

exports.comparePassword = (password, hash) => bcrypt.compareSync(password, hash);

exports.fetchData = async (url) => {
  try {
    const response = await axios.get(url);
    return response?.data;
  } catch (err) {
    return false;
  }
};
