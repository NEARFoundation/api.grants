const nearService = require('../services/nearService');

const getPayments = async (grantApplication, nearAccount) => {
  try {
    const proposals = await nearService.loadProposals(nearAccount);

    return [];
  } catch (err) {
    return [];
  }
};

module.exports = getPayments;
