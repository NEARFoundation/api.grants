const GrantApplicationModel = require('../modules/GrantApplication/GrantApplicationModel');
const calendlyService = require('../services/calendlyService');
const hellosignService = require('../services/hellosignService');
const nearService = require('../services/nearService');
const getPayments = require('./getPayments');
const hashProposal = require('./hashProposal');
const grantConfig = require('../config/grant');
const appConfig = require('../config/app');
const { reportError } = require('../services/errorReportingService');
const logger = require('./logger');

// NOTE: This function should be refactored

// eslint-disable-next-line max-lines-per-function
const getGrant = async (req, res) => {
  try {
    const { id } = req.params;
    const { accountId: nearId } = req.near;

    logger.info('Getting grant', { nearId, id });

    const grantApplication = await GrantApplicationModel.findOne({
      id,
      nearId,
    });

    if (!grantApplication) {
      res.status(404).json({
        message: 'No such GrantApplication under this near account',
      });
      return;
    }

    // demo mode auto approve grant
    if (appConfig.demoMode && grantApplication.dateInterview && !grantApplication.dateApproval) {
      grantApplication.dateInterviewCompletionConfirmation = new Date();
      grantApplication.dateApproval = new Date();
      await grantApplication.save();
    }

    // When the interview is scheduled but the interview had not been completed: get the date of the interview
    if (grantApplication.interviewUrl && !grantApplication.dateInterviewCompletionConfirmation) {
      const dateInterview = await calendlyService.getEventDate(grantApplication.interviewUrl);
      grantApplication.dateInterview = dateInterview;
      await grantApplication.save();
    }

    // When the grant has been approved & the kyc not yet: check the status of the KYC
    if (grantApplication.dateApproval && !grantApplication.dateKycApproved) {
      const isKycApproved = await nearService.verifyKycDao(req.near.account, req.near.accountId);

      if (isKycApproved) {
        grantApplication.dateKycCompletion = new Date();
        grantApplication.dateKycApproved = new Date();
        await grantApplication.save();
      }
    }

    // Demo mode: auto sign the agreement
    if (appConfig.demoMode && grantApplication.dateAgreementSignatureGrantReceiver && !grantApplication.dateAgreementSignatureGrantGiver) {
      grantApplication.dateAgreementSignatureGrantGiver = new Date();
      await grantApplication.save();
    }

    // When the signature has been requested but the agreement not yet signed: check the state of the signature & update the url if needed
    if (grantApplication.helloSignSignatureRequestId && (!grantApplication.dateAgreementSignatureGrantReceiver || !grantApplication.dateAgreementSignatureGrantGiver)) {
      const { dateAgreementSignatureGrantReceiver, dateAgreementSignatureGrantGiver } = await hellosignService.isRequestCompleted(grantApplication.helloSignRequestId);

      if (dateAgreementSignatureGrantReceiver || dateAgreementSignatureGrantGiver) {
        grantApplication.dateAgreementSignatureGrantReceiver = dateAgreementSignatureGrantReceiver;
        grantApplication.dateAgreementSignatureGrantGiver = dateAgreementSignatureGrantGiver;
        await grantApplication.save();
      } else {
        const helloSignRequestUrl = await hellosignService.getSignatureRequestUrl(grantApplication.helloSignSignatureRequestId);
        if (helloSignRequestUrl) {
          grantApplication.helloSignRequestUrl = helloSignRequestUrl;
          await grantApplication.save();
        }
      }
    }

    // When the KYC is approved: generate a signature request
    if (grantApplication.dateKycApproved && grantApplication.dateApproval && !grantApplication.helloSignSignatureRequestId && !grantApplication.helloSignSignatureRequestIdAdmin) {
      const { helloSignRequestId, helloSignSignatureRequestId, helloSignRequestUrl, helloSignSignatureRequestIdAdmin } = await hellosignService.createSignatureRequest(
        grantApplication,
      );
      grantApplication.helloSignSignatureRequestId = helloSignSignatureRequestId;
      grantApplication.helloSignSignatureRequestIdAdmin = helloSignSignatureRequestIdAdmin;
      grantApplication.helloSignRequestUrl = helloSignRequestUrl;
      grantApplication.helloSignRequestId = helloSignRequestId;
      await grantApplication.save();
    }

    // When the agreement is signed create hash of the proposal so that the user can securely submit them
    if (grantApplication.dateAgreementSignatureGrantReceiver && grantApplication.dateAgreementSignatureGrantGiver && !grantApplication.hashProposal) {
      const { fundingAmount, _id } = grantApplication;

      const grantApplicationWithSalt = await GrantApplicationModel.findOne({
        _id,
      }).select({
        salt: 1,
      });

      const { salt } = grantApplicationWithSalt;

      grantApplication.hashProposal = hashProposal(salt, nearId, fundingAmount, 0);

      grantApplication.milestones.map((milestone, index) => {
        const { budget } = milestone;
        const payoutNumber = index + 1;
        // eslint-disable-next-line no-param-reassign
        milestone.hashProposal = hashProposal(salt, nearId, budget, payoutNumber);
        return milestone;
      });

      await grantApplication.save();
    }

    // When the transaction has been submitted get the payment status from all the proposals
    if (grantApplication.hashProposal) {
      const payments = await getPayments(grantApplication, req.near.account);
      grantApplication.payments = payments;

      if (payments.length > 0) {
        grantApplication.dateFirstPaymentSent = payments[0].date;
      }

      if (grantConfig.skipOnboarding && !grantApplication.dateOnboardingCompletion) {
        grantApplication.dateOnboardingCompletion = new Date();
      }

      await grantApplication.save();
    }

    // eslint-disable-next-line consistent-return
    return grantApplication;
  } catch (error) {
    reportError(error, 'Could not get the grant application');
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = getGrant;
