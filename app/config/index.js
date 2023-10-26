const { env } = process;
const envFile = '.env';

require('dotenv').config({ path: `./${envFile}`, silent: true });

module.exports = {
  mongodbUserUri: env.MONGODB_USER_URI
};
