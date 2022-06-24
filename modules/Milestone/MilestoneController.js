const createSchema = require('./MilestoneFormSchema');
const loadAndVerifyMilestoneData = require('../../utilities/loadAndVerifyMilestoneData');

/**
 * MilestoneController.js
 *
 * @description :: Server-side logic for managing Milestones.
 */
module.exports = {
  async update(req, res) {
    try {
      const updatedGrantWithData = await loadAndVerifyMilestoneData(req, res);

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

      await updatedGrantWithData.save();

      return res.json(updatedGrantWithData);
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },

  async validateAndSaveTransactionHash(req, res) {},

  async setInterview(req, res) {},
};
