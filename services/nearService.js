const nearApi = require('near-api-js');
const getTokenId = require('../config/currency');
const nearConfig = require('../config/near');
const kycDaoConfig = require('../config/kycDaoConfig');
const { reportError } = require('./errorReportingService');
const logger = require('../utilities/logger');

module.exports = {
  async verifyTransaction(near, txHash, hashProposal, fundingAmount, nearId) {
    try {
      logger.info('Verifying transaction', { nearId, txHash });
      const networkId = process.env.NEAR_NETWORK_ENV;

      const txStatus = await near.connection.provider.txStatus(txHash, nearId);
      const argsBase64 = txStatus.transaction.actions[0].FunctionCall.args;
      const argsString = Buffer.from(argsBase64, 'base64').toString('utf8');
      const args = JSON.parse(argsString);

      const realTokenId = getTokenId(networkId);
      const realReciverId = nearId;
      const realAmount = BigInt((fundingAmount || 0) * 10 ** 18).toString();

      /* eslint-disable camelcase */
      const { token_id, receiver_id, amount } = args.proposal.kind.Transfer;

      if (
        txStatus.status.SuccessValue &&
        args.proposal.description.includes(hashProposal.slice(0, 8)) &&
        token_id === realTokenId &&
        realReciverId === receiver_id &&
        realAmount === amount
      ) {
        return true;
      }
      /* eslint-enable camelcase */

      return false;
    } catch (error) {
      reportError(error, 'Could not verify transaction from NEAR');
      return false;
    }
  },
  async loadProposals(account) {
    try {
      logger.info('Loading proposals', { account });
      const contract = new nearApi.Contract(account, nearConfig.contractId, {
        viewMethods: ['get_proposals'],
        changeMethods: [],
      });

      // to improve find better solution than loading 100000000
      const proposals = await contract.get_proposals({ from_index: 0, limit: 100000000 });

      return proposals;
    } catch (error) {
      reportError(error, 'Could not load proposal from NEAR');
      return [];
    }
  },
  async verifyKycDao(account, accountId) {
    try {
      logger.info('Verifying kycDao', { account, accountId });
      const networkId = process.env.NEAR_NETWORK_ENV;
      const { contractId } = kycDaoConfig.get(networkId);

      const contract = new nearApi.Contract(account, contractId, {
        viewMethods: ['ntnft_supply_for_owner'],
        changeMethods: [],
      });

      const ntnftsKycDao = await contract.ntnft_supply_for_owner({ account_id: accountId });

      return ntnftsKycDao > 0;
    } catch (error) {
      reportError(error, 'Could not verify kyc dao status');
      return false;
    }
  },
};
