/* eslint-disable no-param-reassign */
const fs = require('fs');
const path = require('path');
const GrantApplicationModel = require('./GrantApplicationModel');
const createSchema = require('./GrantApplicationFormSchema');
const calendlyService = require('../../services/calendlyService');
const getVerifyAndSaveGrantData = require('../../utilities/getVerifyAndSaveGrantData');
const verifySignatureOfString = require('../../utilities/verifySignatureOfString');
const getGrant = require('../../utilities/getGrant');
const grantConfig = require('../../config/grant');
const hellosignService = require('../../services/hellosignService');

/**
 * GrantApplicationController.js
 *
 * @description :: Server-side logic for managing GrantApplications.
 */
module.exports = {
  /**
   * GrantApplicationController.list()
   */
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
        });
        await grantApplication.save();

        return res.json([grantApplication]);
      }

      return res.json(grantApplications);
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },

  /**
   * GrantApplicationController.show()
   */
  async show(req, res) {
    try {
      const grantApplication = await getGrant(req, res);
      return res.json(grantApplication);
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },

  /**
   * GrantApplicationController.saveDraft()
   */
  // eslint-disable-next-line max-lines-per-function
  async saveDraft(req, res) {
    try {
      const grantApplication = await getVerifyAndSaveGrantData(req, res);
      await grantApplication.save();

      return res.json(grantApplication);
    } catch (error) {
      return res.status(500).json({
        message: 'Error when updating grantApplication.',
        error,
      });
    }
  },

  /**
   * GrantApplicationController.submit()
   */
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

        return res.status(400).json({
          message: 'Invalid grant data',
          errors: parsedErrors,
        });
      }

      grantApplication.dateSubmission = new Date();

      if (grantConfig.skipOnboarding) {
        grantApplication.dateEvaluation = new Date();
      }

      await grantApplication.save();

      return res.json(grantApplication);
    } catch (error) {
      return res.status(500).json({
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
        return res.status(400).json({
          message: 'Interview already scheduled',
        });
      }

      if (!grantApplication.dateSubmission && !grantApplication.dateEvaluation) {
        return res.status(400).json({
          message: 'Grant not submitted or not approved',
        });
      }

      const { calendlyUrl, signedCalendlyUrl } = req.body;
      const isSignatureValid = await verifySignatureOfString(signedCalendlyUrl, calendlyUrl, accountId, near);

      if (!isSignatureValid) {
        return res.status(400).json({
          message: 'Invalid signature',
        });
      }

      grantApplication.interviewUrl = calendlyUrl;
      grantApplication.dateInterviewScheduled = new Date();
      grantApplication.dateInterview = await calendlyService.getEventDate(grantApplication.interviewUrl);

      await grantApplication.save();

      return res.json(grantApplication);
    } catch (error) {
      return res.status(500).json({
        message: 'Error when updating grantApplication',
        error,
      });
    }
  },

  async downloadAgreement(req, res) {
    try {
      const grantApplication = await getGrant(req, res);

      if (!grantApplication.dateAgreementSignature || !grantApplication.helloSignRequestId) {
        return res.status(400).json({
          message: 'Agreement not signed',
        });
      }

      const file = await hellosignService.downloadAgreement(grantApplication.helloSignRequestId);

      const fileReadStream = fs.createReadStream(path.join(__dirname, '../..', 'agreements.zip'));
      res.setHeader('Content-disposition', 'attachment; filename=YOUR_FILE.EXTENSION');
      fileReadStream.pipe(res);
      return;
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Error when downloading agreement',
        error,
      });
    }
  },
};
