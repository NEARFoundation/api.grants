const path = require('path');

const config = {
  apiKey: process.env.HELLO_SIGN_API_KEY,
  appClientKey: process.env.HELLO_SIGN_APP_CLIENT_ID,
  testMode: parseInt(process.env.HELLO_SIGN_TEST_MODE, 10),
  subject: 'Grant Service Agreement',
  message: 'Please sign the Grant Service Agreement.',
  templatePath: path.join(__dirname, '..', process.env.HELLO_SIGN_TEMPLATE),
  adminEmail: process.env.HELLO_SIGN_GRANT_ADMIN_EMAIL,
  adminName: process.env.HELLO_SIGN_GRANT_ADMIN_NAME,
};

module.exports = config;
