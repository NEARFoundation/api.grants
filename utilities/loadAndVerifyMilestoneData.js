const GrantApplicationModel = require('../modules/GrantApplication/GrantApplicationModel');
const verifySignatureOfObject = require('./verifySignatureOfObject');

// eslint-disable-next-line max-lines-per-function
const loadAndVerifyMilestoneData = async (req, res) => {
  try {
    const { id, milestoneId } = req.params;
    const { accountId: nearId, near } = req.near;

    const grantApplication = await GrantApplicationModel.findOne({
      id,
      nearId,
    });

    if (!grantApplication) {
      return res.status(404).json({
        message: 'No such GrantApplication under this near account',
      });
    }

    const milestone = grantApplication.miletsones[milestoneId];

    if (milestone.dateSubmission) {
      return res.status(400).json({
        message: 'This milestone has already been submitted',
      });
    }

    if (milestoneId > 0 && !grantApplication.miletsones[milestoneId - 1].dateValidation) {
      return res.status(400).json({
        message: 'The previous milestone needs to be accepted before submitting this one',
      });
    }

    const { signedData, milestoneData } = req.body;

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

    return grantApplication;
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = loadAndVerifyMilestoneData;
