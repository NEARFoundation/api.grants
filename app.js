require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const setUpNear = require('./utilities/setUpNear');
const verifyNearSignatureHeader = require('./middlewares/verifyNearSignatureHeader');
const logger = require('./utilities/logger');
const config = require('./config/app');
const near = require('./middlewares/near');

const grantApplicationRoutes = require('./modules/GrantApplication/GrantApplicationRoutes');

const setup = async () => {
  mongoose.connect(config.mongoUrl);
  const db = mongoose.connection;
  db.on('error', logger.error.bind(logger, '[Mongodb] connection error'));
  db.once('open', () => {
    logger.info('[Mongodb] Connected successfully');
  });
  const app = express();

  const nearApi = await setUpNear();

  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
  };

  app.use(near(nearApi));
  app.use(cors(corsOptions));
  app.use(verifyNearSignatureHeader);

  app.use('/grants', grantApplicationRoutes);

  app.use((req, res, next) => {
    next(createError(404));
  });

  app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  });

  return app;
};

module.exports = setup;
