const GrantApplicationModel = require('../modules/GrantApplication/GrantApplicationModel');

// eslint-disable-next-line max-lines-per-function
const loadAndVerifyMilestoneAndGrant = async (req, res) => {
  try {
    const { id, milestoneId } = req.params;
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

    const milestone = grantApplication.milestones[milestoneId];

    if (milestoneId > 0 && !grantApplication.milestones[milestoneId - 1].dateValidation) {
      return res.status(400).json({
        message: 'The previous milestone needs to be accepted before submitting this one',
      });
    }

    return { milestone, grantApplication };
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = loadAndVerifyMilestoneAndGrant;
