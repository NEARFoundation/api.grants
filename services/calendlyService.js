const axios = require('axios');
const config = require('../config/calendly');
const { reportError } = require('./errorReportingService');
const logger = require('../utilities/logger');

const headers = {
  Authorization: `Bearer ${config.accessToken}`,
  'Content-Type': 'application/json',
};

module.exports = {
  async getEventDate(url) {
    try {
      logger.info('Getting data from calendly event', { url });
      const { data } = await axios.get(url, { headers });
      return data.resource.start_time;
    } catch (error) {
      reportError(error, 'Could not get date event calendly');
      return null;
    }
  },
};
