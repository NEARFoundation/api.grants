const basicAuth = require('express-basic-auth');
const config = require('../config/app');

const authorizer = basicAuth({
  users: { [config.adminLogin]: config.adminPassword },
  challenge: true,
});

module.exports = authorizer;
