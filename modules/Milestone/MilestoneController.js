const createSchema = require('./MilestoneFormSchema');
const loadAndVerifyMilestoneAndGrant = require('../../utilities/loadAndVerifyMilestoneAndGrant');
const verifySignatureOfObject = require('../../utilities/verifySignatureOfObject');

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

  async validateAndSaveTransactionHash(req, res) {},

  async setInterview(req, res) {},
};
