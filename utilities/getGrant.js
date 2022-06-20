const GrantApplicationModel = require('../modules/GrantApplication/GrantApplicationModel');

const getGrant = async (req, res) => {
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

    return grantApplication;
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = getGrant;
