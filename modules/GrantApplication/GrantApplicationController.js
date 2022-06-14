/* eslint-disable no-param-reassign */
const GrantapplicationModel = require('./GrantApplicationModel');

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
      const grantApplications = await GrantapplicationModel.find({});

      if (grantApplications.length === 0) {
        const grantApplication = new GrantapplicationModel({
          nearId: 't3st.testnet',
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
  show(req, res) {
    const { id } = req.params;

    GrantapplicationModel.findOne({ _id: id }, (err, GrantApplication) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting GrantApplication.',
          error: err,
        });
      }

      if (!GrantApplication) {
        return res.status(404).json({
          message: 'No such GrantApplication',
        });
      }

      return res.json(GrantApplication);
    });
  },

  /**
   * GrantApplicationController.create()
   */
  // eslint-disable-next-line max-lines-per-function
  create(req, res) {
    const GrantApplication = new GrantapplicationModel({
      nearId: req.body.nearId,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      dateOfBirth: req.body.dateOfBirth,
      email: req.body.email,
      github: req.body.github,
      twitter: req.body.twitter,
      workingAloneOrTeam: req.body.workingAloneOrTeam,
      aboutTeam: req.body.aboutTeam,
      teamMembers: req.body.teamMembers,
      hasPreviouslyReceivedFundingTokensGrantsFromNear: req.body.hasPreviouslyReceivedFundingTokensGrantsFromNear,
      aboutTokensReceivedFromNear: req.body.aboutTokensReceivedFromNear,
      projectName: req.body.projectName,
      grantType: req.body.grantType,
      grantCategory: req.body.grantCategory,
      projectUrl: req.body.projectUrl,
      githubUrl: req.body.githubUrl,
      projectStatus: req.body.projectStatus,
      projectLaunchDate: req.body.projectLaunchDate,
      projectDescription: req.body.projectDescription,
      currency: req.body.currency,
      fundingAmount: req.body.fundingAmount,
      nearFundingAmount: req.body.nearFundingAmount,
      whatAndWhy: req.body.whatAndWhy,
      competitionDifference: req.body.competitionDifference,
      openSourceState: req.body.openSourceState,
      opensourceComponentUse: req.body.opensourceComponentUse,
      impactOnEcosystem: req.body.impactOnEcosystem,
      excitementNear: req.body.excitementNear,
      successMesurement: req.body.successMesurement,
      projectRaisingRound: req.body.projectRaisingRound,
      attachment: req.body.attachment,
      addressCountry: req.body.addressCountry,
      addressCity: req.body.addressCity,
      addressStreet: req.body.addressStreet,
      addressZip: req.body.addressZip,
      howHeardGrants: req.body.howHeardGrants,
      referral: req.body.referral,
      teamReferral: req.body.teamReferral,
      comments: req.body.comments,
      dateLastDraftSaving: req.body.dateLastDraftSaving,
      dateSubmission: req.body.dateSubmission,
      proposalNearTransactionHash: req.body.proposalNearTransactionHash,
      isNearProposalValid: req.body.isNearProposalValid,
      dateEvaluation: req.body.dateEvaluation,
      dateInterviewScheduled: req.body.dateInterviewScheduled,
      dateInterview: req.body.dateInterview,
      dateInterviewCompletionConfirmation: req.body.dateInterviewCompletionConfirmation,
      dateDenial: req.body.dateDenial,
      dateApproval: req.body.dateApproval,
      dateKycCompletion: req.body.dateKycCompletion,
      dateKycDenied: req.body.dateKycDenied,
      dateKycApproved: req.body.dateKycApproved,
      dateAgreementSignature: req.body.dateAgreementSignature,
      dateOnboardingMeeting: req.body.dateOnboardingMeeting,
      dateFirstPaymentSent: req.body.dateFirstPaymentSent,
      dateOnboardingCompletion: req.body.dateOnboardingCompletion,
      helloSignRequestId: req.body.helloSignRequestId,
      interviewUrl: req.body.interviewUrl,
      kycUrl: req.body.kycUrl,
      agreementUrl: req.body.agreementUrl,
      invoiceUrl: req.body.invoiceUrl,
      reviewProject: req.body.reviewProject,
      reviewMemberDetail: req.body.reviewMemberDetail,
      reviewAttachments: req.body.reviewAttachments,
      milestones: req.body.milestones,
      payments: req.body.payments,
    });

    GrantApplication.save((err) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when creating GrantApplication',
          error: err,
        });
      }

      return res.status(201).json(GrantApplication);
    });
  },

  /**
   * GrantApplicationController.saveDraft()
   */
  // eslint-disable-next-line max-lines-per-function
  saveDraft(req, res) {
    const { id } = req.params;

    // eslint-disable-next-line max-lines-per-function, consistent-return
    GrantapplicationModel.findOne({ _id: id }, (err, GrantApplication) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting GrantApplication',
          error: err,
        });
      }

      if (!GrantApplication) {
        return res.status(404).json({
          message: 'No such GrantApplication',
        });
      }

      GrantApplication.nearId = req.body.nearId ? req.body.nearId : GrantApplication.nearId;
      GrantApplication.firstname = req.body.firstname ? req.body.firstname : GrantApplication.firstname;
      GrantApplication.lastname = req.body.lastname ? req.body.lastname : GrantApplication.lastname;
      GrantApplication.dateOfBirth = req.body.dateOfBirth ? req.body.dateOfBirth : GrantApplication.dateOfBirth;
      GrantApplication.email = req.body.email ? req.body.email : GrantApplication.email;
      GrantApplication.github = req.body.github ? req.body.github : GrantApplication.github;
      GrantApplication.twitter = req.body.twitter ? req.body.twitter : GrantApplication.twitter;
      GrantApplication.workingAloneOrTeam = req.body.workingAloneOrTeam ? req.body.workingAloneOrTeam : GrantApplication.workingAloneOrTeam;
      GrantApplication.aboutTeam = req.body.aboutTeam ? req.body.aboutTeam : GrantApplication.aboutTeam;
      GrantApplication.teamMembers = req.body.teamMembers ? req.body.teamMembers : GrantApplication.teamMembers;
      GrantApplication.hasPreviouslyReceivedFundingTokensGrantsFromNear = req.body.hasPreviouslyReceivedFundingTokensGrantsFromNear
        ? req.body.hasPreviouslyReceivedFundingTokensGrantsFromNear
        : GrantApplication.hasPreviouslyReceivedFundingTokensGrantsFromNear;
      GrantApplication.aboutTokensReceivedFromNear = req.body.aboutTokensReceivedFromNear ? req.body.aboutTokensReceivedFromNear : GrantApplication.aboutTokensReceivedFromNear;
      GrantApplication.projectName = req.body.projectName ? req.body.projectName : GrantApplication.projectName;
      GrantApplication.grantType = req.body.grantType ? req.body.grantType : GrantApplication.grantType;
      GrantApplication.grantCategory = req.body.grantCategory ? req.body.grantCategory : GrantApplication.grantCategory;
      GrantApplication.projectUrl = req.body.projectUrl ? req.body.projectUrl : GrantApplication.projectUrl;
      GrantApplication.githubUrl = req.body.githubUrl ? req.body.githubUrl : GrantApplication.githubUrl;
      GrantApplication.projectStatus = req.body.projectStatus ? req.body.projectStatus : GrantApplication.projectStatus;
      GrantApplication.projectLaunchDate = req.body.projectLaunchDate ? req.body.projectLaunchDate : GrantApplication.projectLaunchDate;
      GrantApplication.projectDescription = req.body.projectDescription ? req.body.projectDescription : GrantApplication.projectDescription;
      GrantApplication.currency = req.body.currency ? req.body.currency : GrantApplication.currency;
      GrantApplication.fundingAmount = req.body.fundingAmount ? req.body.fundingAmount : GrantApplication.fundingAmount;
      GrantApplication.nearFundingAmount = req.body.nearFundingAmount ? req.body.nearFundingAmount : GrantApplication.nearFundingAmount;
      GrantApplication.whatAndWhy = req.body.whatAndWhy ? req.body.whatAndWhy : GrantApplication.whatAndWhy;
      GrantApplication.competitionDifference = req.body.competitionDifference ? req.body.competitionDifference : GrantApplication.competitionDifference;
      GrantApplication.openSourceState = req.body.openSourceState ? req.body.openSourceState : GrantApplication.openSourceState;
      GrantApplication.opensourceComponentUse = req.body.opensourceComponentUse ? req.body.opensourceComponentUse : GrantApplication.opensourceComponentUse;
      GrantApplication.impactOnEcosystem = req.body.impactOnEcosystem ? req.body.impactOnEcosystem : GrantApplication.impactOnEcosystem;
      GrantApplication.excitementNear = req.body.excitementNear ? req.body.excitementNear : GrantApplication.excitementNear;
      GrantApplication.successMesurement = req.body.successMesurement ? req.body.successMesurement : GrantApplication.successMesurement;
      GrantApplication.projectRaisingRound = req.body.projectRaisingRound ? req.body.projectRaisingRound : GrantApplication.projectRaisingRound;
      GrantApplication.attachment = req.body.attachment ? req.body.attachment : GrantApplication.attachment;
      GrantApplication.addressCountry = req.body.addressCountry ? req.body.addressCountry : GrantApplication.addressCountry;
      GrantApplication.addressCity = req.body.addressCity ? req.body.addressCity : GrantApplication.addressCity;
      GrantApplication.addressStreet = req.body.addressStreet ? req.body.addressStreet : GrantApplication.addressStreet;
      GrantApplication.addressZip = req.body.addressZip ? req.body.addressZip : GrantApplication.addressZip;
      GrantApplication.howHeardGrants = req.body.howHeardGrants ? req.body.howHeardGrants : GrantApplication.howHeardGrants;
      GrantApplication.referral = req.body.referral ? req.body.referral : GrantApplication.referral;
      GrantApplication.teamReferral = req.body.teamReferral ? req.body.teamReferral : GrantApplication.teamReferral;
      GrantApplication.comments = req.body.comments ? req.body.comments : GrantApplication.comments;
      GrantApplication.dateLastDraftSaving = req.body.dateLastDraftSaving ? req.body.dateLastDraftSaving : GrantApplication.dateLastDraftSaving;
      GrantApplication.dateSubmission = req.body.dateSubmission ? req.body.dateSubmission : GrantApplication.dateSubmission;
      GrantApplication.proposalNearTransactionHash = req.body.proposalNearTransactionHash ? req.body.proposalNearTransactionHash : GrantApplication.proposalNearTransactionHash;
      GrantApplication.isNearProposalValid = req.body.isNearProposalValid ? req.body.isNearProposalValid : GrantApplication.isNearProposalValid;
      GrantApplication.dateEvaluation = req.body.dateEvaluation ? req.body.dateEvaluation : GrantApplication.dateEvaluation;
      GrantApplication.dateInterviewScheduled = req.body.dateInterviewScheduled ? req.body.dateInterviewScheduled : GrantApplication.dateInterviewScheduled;
      GrantApplication.dateInterview = req.body.dateInterview ? req.body.dateInterview : GrantApplication.dateInterview;
      GrantApplication.dateInterviewCompletionConfirmation = req.body.dateInterviewCompletionConfirmation
        ? req.body.dateInterviewCompletionConfirmation
        : GrantApplication.dateInterviewCompletionConfirmation;
      GrantApplication.dateDenial = req.body.dateDenial ? req.body.dateDenial : GrantApplication.dateDenial;
      GrantApplication.dateApproval = req.body.dateApproval ? req.body.dateApproval : GrantApplication.dateApproval;
      GrantApplication.dateKycCompletion = req.body.dateKycCompletion ? req.body.dateKycCompletion : GrantApplication.dateKycCompletion;
      GrantApplication.dateKycDenied = req.body.dateKycDenied ? req.body.dateKycDenied : GrantApplication.dateKycDenied;
      GrantApplication.dateKycApproved = req.body.dateKycApproved ? req.body.dateKycApproved : GrantApplication.dateKycApproved;
      GrantApplication.dateAgreementSignature = req.body.dateAgreementSignature ? req.body.dateAgreementSignature : GrantApplication.dateAgreementSignature;
      GrantApplication.dateOnboardingMeeting = req.body.dateOnboardingMeeting ? req.body.dateOnboardingMeeting : GrantApplication.dateOnboardingMeeting;
      GrantApplication.dateFirstPaymentSent = req.body.dateFirstPaymentSent ? req.body.dateFirstPaymentSent : GrantApplication.dateFirstPaymentSent;
      GrantApplication.dateOnboardingCompletion = req.body.dateOnboardingCompletion ? req.body.dateOnboardingCompletion : GrantApplication.dateOnboardingCompletion;
      GrantApplication.helloSignRequestId = req.body.helloSignRequestId ? req.body.helloSignRequestId : GrantApplication.helloSignRequestId;
      GrantApplication.interviewUrl = req.body.interviewUrl ? req.body.interviewUrl : GrantApplication.interviewUrl;
      GrantApplication.kycUrl = req.body.kycUrl ? req.body.kycUrl : GrantApplication.kycUrl;
      GrantApplication.agreementUrl = req.body.agreementUrl ? req.body.agreementUrl : GrantApplication.agreementUrl;
      GrantApplication.invoiceUrl = req.body.invoiceUrl ? req.body.invoiceUrl : GrantApplication.invoiceUrl;
      GrantApplication.reviewProject = req.body.reviewProject ? req.body.reviewProject : GrantApplication.reviewProject;
      GrantApplication.reviewMemberDetail = req.body.reviewMemberDetail ? req.body.reviewMemberDetail : GrantApplication.reviewMemberDetail;
      GrantApplication.reviewAttachments = req.body.reviewAttachments ? req.body.reviewAttachments : GrantApplication.reviewAttachments;
      GrantApplication.milestones = req.body.milestones ? req.body.milestones : GrantApplication.milestones;
      GrantApplication.payments = req.body.payments ? req.body.payments : GrantApplication.payments;

      GrantApplication.save(() => {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating GrantApplication.',
            error: err,
          });
        }

        return res.json(GrantApplication);
      });
    });
  },

  /**
   * GrantApplicationController.submit()
   */
  submit() {},
};
