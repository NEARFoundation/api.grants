/**
 * MilestoneController.js
 *
 * @description :: Server-side logic for managing Milestones.
 */
module.exports = {
  async update(req, res) {
    try {
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },

  async validateAndSaveTransactionHash(req, res) {},

  async setInterview(req, res) {},
};
