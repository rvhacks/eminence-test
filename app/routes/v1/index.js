const app = require('express')();
const { verifyAuthToken } = require('../../middleware');

app.use('/auth', require('./auth'));

app.use('/products', verifyAuthToken, require('./products'));

module.exports = app;
