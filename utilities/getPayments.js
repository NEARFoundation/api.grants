const nearService = require('../services/nearService');
const hashProposal = require('./hashProposal');
const config = require('../config/app');
const GrantApplicationModel = require('../modules/GrantApplication/GrantApplicationModel');

const getPayments = async (grantApplication, nearAccount) => {
  try {
    const { appName } = config;
    const { _id, nearId, currency } = grantApplication;

    const grantApplicationWithSalt = await GrantApplicationModel.findOne({
      _id,
    }).select({
      salt: 1,
    });

    const { salt } = grantApplicationWithSalt;

    const proposals = await nearService.loadProposals(nearAccount);
    const milestonesHashes = grantApplication.milestones.map((milestone) => milestone.hashProposal.slice(0, 8));
    const hashes = [grantApplication.hashProposal.slice(0, 8), ...milestonesHashes];

    const validPaymentsProposal = proposals.filter((proposal) => {
      const containsAppName = proposal.description.includes(appName);
      if (!containsAppName) {
        return false;
      }

      const isValidUser = proposal.proposer === nearId && proposal.kind.Transfer.receiver_id === nearId;
      if (!isValidUser) {
        return false;
      }

      const isHashIncluded = new RegExp(hashes.join('|')).test(proposal.description);
      if (!isHashIncluded) {
        return false;
      }

      // eslint-disable-next-line no-useless-escape
      const proposalRegex = proposal.description.match(/\#([1-9][0-9]?) \|/);
      const proposalNumber = proposalRegex ? proposalRegex[1] : 0;

      const fundingAmount = BigInt(proposal.kind.Transfer.amount / 10 ** 18).toString();
      const calculatedHash = hashProposal(salt, nearId, fundingAmount, proposalNumber).slice(0, 8);
      const proposalHash = proposal.description.slice(-8);

      return calculatedHash === proposalHash;
    });

    const payments = validPaymentsProposal.map((proposal) => {
      // eslint-disable-next-line no-useless-escape
      const proposalRegex = proposal.description.match(/\#([1-9][0-9]?) \|/);
      const milestoneNumber = proposalRegex ? proposalRegex[1] : 0;
      const amount = BigInt(proposal.kind.Transfer.amount / 10 ** 18).toString();

      return {
        id: proposal.id,
        amount,
        milestoneNumber,
        currency,
        date: new Date(proposal.submission_time / 1000000),
        status: proposal.status === 'Approved' ? 'paid' : 'pending',
      };
    });

    return payments;
  } catch (err) {
    return [];
  }
};

module.exports = getPayments;
