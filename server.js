// eslint-disable-next-line n/no-path-concat
require('app-module-path').addPath(`${__dirname}/`);
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const path = require('path');
const HttpStatus = require('http-status');
const { env } = require('./app/constant/environment');
const { connections } = require('./app/config/database');
const response = require('./app/response');

const app = express();

global.appRoot = path.join(__dirname);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set(path.join(__dirname));
app.use(express.static(__dirname));
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

const httpServer = http
  .createServer(app.handle.bind(app))
  .listen(env.PORT, () => {
    console.info(`Server up successfully - port: ${env.PORT}`);
  });

app.use('/', require('./app/routes'));

app.use('/test', (req, res) => {
  console.log('Request captured');
  return res.send('Test is successful');
});

// In case of invalid routes
app.use((req, res) => {
  return response.error(req, res, { msgCode: 'ERR0002' }, HttpStatus.NOT_FOUND);
});

process.on('unhandledRejection', (err) => {
  console.error('Possibly unhandled rejection happened');
  console.error(err.message);
});

const closeHandler = () => {
  Object.values(connections).forEach((connection) => connection.close());
  httpServer.close(() => {
    console.info('Server is stopped successfully');
    process.exit(0);
  });
};

process.on('SIGTERM', closeHandler);
process.on('SIGINT', closeHandler);
