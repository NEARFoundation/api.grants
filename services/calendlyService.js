const axios = require('axios');
const config = require('../config/calendly');

const headers = {
  Authorization: `Bearer ${config.accessToken}`,
  'Content-Type': 'application/json',
};

module.exports = {
  async getEventDate(url) {
    try {
      const { data } = await axios.get(url, { headers });
      return data.resource.start_time;
    } catch (err) {
      return null;
    }
  },
};
