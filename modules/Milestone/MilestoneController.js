const createSchema = require('./MilestoneFormSchema');
const loadAndVerifyMilestoneAndGrant = require('../../utilities/loadAndVerifyMilestoneAndGrant');
const verifySignatureOfObject = require('../../utilities/verifySignatureOfObject');
const verifySignatureOfString = require('../../utilities/verifySignatureOfString');
const calendlyService = require('../../services/calendlyService');
const nearService = require('../../services/nearService');
const { reportError } = require('../../services/errorReportingService');
const logger = require('../../utilities/logger');

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

      logger.info('Updating milestone', { nearId });

      const { milestone, grantApplication } = await loadAndVerifyMilestoneAndGrant(req, res);

      if (milestone.dateSubmission) {
        res.status(400).json({
          message: 'This milestone has already been submitted',
        });
        return;
      }

      const isSignatureValid = await verifySignatureOfObject(signedData, milestoneData, nearId, near);
      if (!isSignatureValid) {
        res.status(401).json({
          message: 'Invalid signature',
        });
        return;
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

        res.status(400).json({
          message: 'Invalid grant data',
          errors: parsedErrors,
        });
        return;
      }

      await grantApplication.save();

      res.json(grantApplication);
    } catch (error) {
      reportError(error, 'Could not submit milestone');
      res.status(500).json({
        message: error.message,
      });
    }
  },

  async validateAndSaveTransactionHash(req, res) {
    try {
      const { accountId } = req.near;
      logger.info('Validating transaction hash for milestone', { nearId: accountId });

      const { milestone, grantApplication } = await loadAndVerifyMilestoneAndGrant(req, res);

      if (!milestone.dateSubmission) {
        res.status(400).json({
          message: 'This milestone had not been submitted yet',
        });
        return;
      }

      if (milestone.proposalNearTransactionHash) {
        res.status(400).json({
          message: 'Milestone transaction already done on chain',
        });
        return;
      }

      const { proposalNearTransactionHash } = req.body;

      const { nearId } = grantApplication;
      const { hashProposal, budget: fundingAmount } = milestone;

      const isTransactionValid = await nearService.verifyTransaction(req.near.near, proposalNearTransactionHash, hashProposal, fundingAmount, nearId);

      if (!isTransactionValid) {
        res.status(400).json({
          message: 'Invalid transaction',
        });
        return;
      }

      milestone.proposalNearTransactionHash = proposalNearTransactionHash;
      milestone.isNearProposalValid = true;

      await grantApplication.save();

      res.json(grantApplication);
    } catch (error) {
      reportError(error, 'Could not validate transaction hash of milestone');
      res.status(500).json({
        message: error.message,
      });
    }
  },

  async setInterview(req, res) {
    try {
      const { accountId, near } = req.near;
      logger.info('Setting interview for milestone', { nearId: accountId });

      const { milestone, grantApplication } = await loadAndVerifyMilestoneAndGrant(req, res);

      if (milestone.interviewUrl) {
        res.status(400).json({
          message: 'Interview already scheduled',
        });
        return;
      }

      if (!milestone.dateSubmission || !milestone.proposalNearTransactionHash || !milestone.isNearProposalValid) {
        res.status(400).json({
          message: 'This milestone had not been submitted',
        });
        return;
      }

      const { calendlyUrl, signedCalendlyUrl } = req.body;
      const isSignatureValid = await verifySignatureOfString(signedCalendlyUrl, calendlyUrl, accountId, near);

      if (!isSignatureValid) {
        res.status(400).json({
          message: 'Invalid signature',
        });
        return;
      }

      milestone.interviewUrl = calendlyUrl;
      milestone.dateInterviewScheduled = new Date();
      milestone.dateInterview = await calendlyService.getEventDate(milestone.interviewUrl);

      await grantApplication.save();

      res.json(grantApplication);
    } catch (error) {
      reportError(error, 'Could not set interview of milestone');
      res.status(500).json({
        message: error.message,
      });
    }
  },
};
