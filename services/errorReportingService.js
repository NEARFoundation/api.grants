const logger = require('../utilities/logger');

module.exports = {
  async reportError(error, message = '') {
    logger.error(`Error: ${message}`, { error });
    // add your error logging tool here
  },
};
