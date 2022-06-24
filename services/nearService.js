const getTokenId = require('../config/currency');

module.exports = {
  async verifyTransaction(near, txHash, hashProposal, fundingAmount, nearId) {
    try {
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
    } catch (e) {
      return false;
    }
  },
};
