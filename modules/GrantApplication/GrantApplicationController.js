/* eslint-disable no-param-reassign */
const GrantApplicationModel = require('./GrantApplicationModel');
const getVerifyAndSaveGrantData = require('../../utilities/getVerifyAndSaveGrantData');
const createSchema = require('./GrantApplicationFormSchema');

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
      const { id } = req.params;
      const { accountId: nearId } = req.near;

      const grantApplication = await GrantApplicationModel.findOne({
        id,
        nearId,
      });

      if (!grantApplication) {
        return res.status(404).json({
          message: 'No such GrantApplication under this near account',
        });
      }

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

      const grantValidationSchema = createSchema();
      const result = grantValidationSchema.safeParse(req.body.grantData);

      const errors = result.error.issues;

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

      // grantApplication.dateSubmission = new Date();
      await grantApplication.save();

      return res.json(grantApplication);
    } catch (error) {
      console.log('EROOOOOOR');
      console.log(error);
      return res.status(500).json({
        message: 'Error when updating grantApplication.',
        error,
      });
    }
  },
};
