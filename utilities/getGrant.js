const GrantApplicationModel = require('../modules/GrantApplication/GrantApplicationModel');
const calendlyService = require('../services/calendlyService');
const hellosignService = require('../services/hellosignService');

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

    const { firstname, lastname, email } = grantApplication;
    const fullname = `${firstname} ${lastname}`;

    if (grantApplication.interviewUrl && !grantApplication.dateInterviewCompletionConfirmation) {
      const dateInterview = await calendlyService.getEventDate(grantApplication.interviewUrl);
      grantApplication.dateInterview = dateInterview;
      await grantApplication.save();
    }

    if (grantApplication.helloSignRequestId && !grantApplication.dateAgreementSignature) {
      const { helloSignRequestUrl } = await hellosignService.getSignatureRequestUrl(grantApplication.helloSignRequestId);
      grantApplication.helloSignRequestUrl = helloSignRequestUrl;
      await grantApplication.save();
    }

    if (grantApplication.dateKycApproved && grantApplication.dateApproval && !grantApplication.helloSignRequestId) {
      const { helloSignRequestId, helloSignRequestUrl } = await hellosignService.createSignatureRequest(email, fullname);
      grantApplication.helloSignRequestId = helloSignRequestId;
      grantApplication.helloSignRequestUrl = helloSignRequestUrl;
      await grantApplication.save();
    }

    return grantApplication;
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = getGrant;
