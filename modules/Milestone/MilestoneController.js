const createSchema = require('./MilestoneFormSchema');
const loadAndVerifyMilestoneAndGrant = require('../../utilities/loadAndVerifyMilestoneAndGrant');
const verifySignatureOfObject = require('../../utilities/verifySignatureOfObject');
const nearService = require('../../services/nearService');

/**
 * MilestoneController.js
 *
 * @description :: Server-side logic for managing Milestones.
 */
module.exports = {
  async update(req, res) {
    try {
      const { accountId: nearId, near } = req.near;
      const { signedData, milestoneData } = req.body;

      const { milestone, grantApplication } = await loadAndVerifyMilestoneAndGrant(req, res);

      if (milestone.dateSubmission) {
        return res.status(400).json({
          message: 'This milestone has already been submitted',
        });
      }

      const isSignatureValid = await verifySignatureOfObject(signedData, milestoneData, nearId, near);
      if (!isSignatureValid) {
        return res.status(401).json({
          message: 'Invalid signature',
        });
      }

      milestone.githubUrl = milestoneData.githubUrl;
      milestone.attachment = milestoneData.attachment;
      milestone.comments = milestoneData.comments;
      milestone.dateSubmission = new Date();

      // eslint-disable-next-line no-underscore-dangle
      const milestoneValidationSchema = createSchema(req.__);
      const result = milestoneValidationSchema.safeParse(req.body.milestoneData);
      const errors = (result && result.error && result.error.issues) || [];

      if (errors.length > 0) {
        const parsedErrors = {};

        errors.forEach((error) => {
          const path = error.path.join('.');
          parsedErrors[path] = error.message;
        });

        return res.status(400).json({
          message: 'Invalid grant data',
          errors: parsedErrors,
        });
      }

      await grantApplication.save();

      return res.json(grantApplication);
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },

  async validateAndSaveTransactionHash(req, res) {
    try {
      const { milestone, grantApplication } = await loadAndVerifyMilestoneAndGrant(req, res);

      if (!milestone.dateSubmission) {
        return res.status(400).json({
          message: 'This milestone had not been submitted yet',
        });
      }

      if (milestone.proposalNearTransactionHash) {
        return res.status(400).json({
          message: 'Milestone transaction already done on chain',
        });
      }

      const { proposalNearTransactionHash } = req.body;

      const { nearId } = grantApplication;
      const { hashProposal, budget: fundingAmount } = milestone;

      const isTransactionValid = await nearService.verifyTransaction(req.near.near, proposalNearTransactionHash, hashProposal, fundingAmount, nearId);

      if (!isTransactionValid) {
        return res.status(400).json({
          message: 'Invalid transaction',
        });
      }

      milestone.proposalNearTransactionHash = proposalNearTransactionHash;
      milestone.isNearProposalValid = true;

      await grantApplication.save();

      return res.json(grantApplication);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: err.message,
      });
    }
  },

  async setInterview(req, res) {},
};
