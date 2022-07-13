/* eslint-disable no-param-reassign */
const fs = require('fs');
const crypto = require('crypto');
const GrantApplicationModel = require('./GrantApplicationModel');
const createSchema = require('./GrantApplicationFormSchema');
const calendlyService = require('../../services/calendlyService');
const getVerifyAndSaveGrantData = require('../../utilities/getVerifyAndSaveGrantData');
const verifySignatureOfString = require('../../utilities/verifySignatureOfString');
const getGrant = require('../../utilities/getGrant');
const grantConfig = require('../../config/grant');
const hellosignService = require('../../services/hellosignService');
const nearService = require('../../services/nearService');
const { reportError } = require('../../services/errorReportingService');

/**
 * GrantApplicationController.js
 *
 * @description :: Server-side logic for managing GrantApplications.
 */
module.exports = {
  async list(req, res) {
    try {
      const { accountId: nearId } = req.near;

      const grantApplications = await GrantApplicationModel.find({
        nearId,
      }).select({
        _id: 1,
        id: 1,
        nearId: 1,
      });

      if (grantApplications.length === 0) {
        const grantApplication = new GrantApplicationModel({
          nearId: req.near.accountId,
          currency: grantConfig.defaultCurrency,
          salt: crypto.randomBytes(16).toString('hex'),
        });
        await grantApplication.save();

        res.json([grantApplication]);
        return;
      }

      res.json(grantApplications);
    } catch (error) {
      reportError(error, 'Could not get list grant applications');
      res.status(500).json({
        message: error.message,
      });
    }
  },

  async show(req, res) {
    try {
      const grantApplication = await getGrant(req, res);
      res.json(grantApplication);
    } catch (error) {
      reportError(error, 'Could not get grant applications');
      res.status(500).json({
        message: error.message,
      });
    }
  },

  // eslint-disable-next-line max-lines-per-function
  async saveDraft(req, res) {
    try {
      const grantApplication = await getVerifyAndSaveGrantData(req, res);
      await grantApplication.save();

      res.json(grantApplication);
    } catch (error) {
      reportError(error, 'Could not save draft');
      res.status(500).json({
        message: 'Error when updating grantApplication.',
        error,
      });
    }
  },

  async submit(req, res) {
    try {
      const grantApplication = await getVerifyAndSaveGrantData(req, res);

      // eslint-disable-next-line no-underscore-dangle
      const grantValidationSchema = createSchema(req.__);
      const result = grantValidationSchema.safeParse(req.body.grantData);

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

      grantApplication.dateSubmission = new Date();

      if (grantConfig.skipEvaluationApproval) {
        grantApplication.dateEvaluation = new Date();
      }

      await grantApplication.save();

      res.json(grantApplication);
    } catch (error) {
      reportError(error, 'Could not submit grant application');
      res.status(500).json({
        message: 'Error when updating grantApplication.',
        error,
      });
    }
  },

  async setInterview(req, res) {
    try {
      const grantApplication = await getGrant(req, res);
      const { accountId, near } = req.near;

      if (grantApplication.interviewUrl) {
        res.status(400).json({
          message: 'Interview already scheduled',
        });
        return;
      }

      if (!grantApplication.dateSubmission && !grantApplication.dateEvaluation) {
        res.status(400).json({
          message: 'Grant not submitted or not approved',
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

      grantApplication.interviewUrl = calendlyUrl;
      grantApplication.dateInterviewScheduled = new Date();
      grantApplication.dateInterview = await calendlyService.getEventDate(grantApplication.interviewUrl);

      await grantApplication.save();

      res.json(grantApplication);
    } catch (error) {
      reportError(error, 'Could not set interview');
      res.status(500).json({
        message: 'Error when updating grantApplication',
        error,
      });
    }
  },

  async downloadAgreement(req, res) {
    try {
      const grantApplication = await getGrant(req, res);

      if (!grantApplication.dateAgreementSignatureGrantReceiver || !grantApplication.dateAgreementSignatureGrantGiver || !grantApplication.helloSignRequestId) {
        res.status(400).json({
          message: 'Agreement not signed',
        });
        return;
      }

      const fileName = await hellosignService.downloadAgreement(grantApplication.helloSignRequestId);

      res.download(fileName, 'agreement.zip', () => {
        fs.unlinkSync(fileName);
      });
    } catch (error) {
      reportError(error, 'Could not download agreement');
      res.status(500).json({
        message: 'Error when downloading agreement',
        error,
      });
    }
  },

  async validateAndSaveTransactionHash(req, res) {
    try {
      const grantApplication = await getGrant(req, res);

      if (grantApplication.proposalNearTransactionHash) {
        res.status(400).json({
          message: 'Transaction already done on chain',
        });
        return;
      }

      const { proposalNearTransactionHash } = req.body;
      const { hashProposal, fundingAmount, nearId } = grantApplication;

      const isTransactionValid = await nearService.verifyTransaction(req.near.near, proposalNearTransactionHash, hashProposal, fundingAmount, nearId);

      if (!isTransactionValid) {
        res.status(400).json({
          message: 'Invalid transaction',
        });
        return;
      }

      grantApplication.proposalNearTransactionHash = proposalNearTransactionHash;
      grantApplication.isNearProposalValid = true;

      await grantApplication.save();

      res.json(grantApplication);
    } catch (error) {
      reportError(error, 'Could not validate transaction hash');
      res.status(500).json({
        message: 'The transaction could not be validated',
        error,
      });
    }
  },
};
