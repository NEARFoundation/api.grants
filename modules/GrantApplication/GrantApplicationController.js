/* eslint-disable no-param-reassign */
const GrantApplicationModel = require('./GrantApplicationModel');
const verifySignatureOfObject = require('../../utilities/verifySignatureOfObject');

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
      const { id } = req.params;
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

      if (grantApplication.dateSubmission) {
        return res.status(400).json({
          message: 'Cannot update a submitted GrantApplication',
        });
      }

      const { grantData, signedGrantData } = req.body;

      const isSignatureValid = await verifySignatureOfObject(signedGrantData, grantData, nearId, near);

      if (!isSignatureValid) {
        return res.status(403).json({
          message: 'Invalid signature',
        });
      }

      grantApplication.firstname = grantData.firstname ? grantData.firstname : grantApplication.firstname;
      grantApplication.lastname = grantData.lastname ? grantData.lastname : grantApplication.lastname;
      grantApplication.dateOfBirth = grantData.dateOfBirth ? grantData.dateOfBirth : grantApplication.dateOfBirth;
      grantApplication.email = grantData.email ? grantData.email : grantApplication.email;
      grantApplication.github = grantData.github ? grantData.github : grantApplication.github;
      grantApplication.twitter = grantData.twitter ? grantData.twitter : grantApplication.twitter;
      grantApplication.workingAloneOrTeam = grantData.workingAloneOrTeam ? grantData.workingAloneOrTeam : grantApplication.workingAloneOrTeam;
      grantApplication.aboutTeam = grantData.aboutTeam ? grantData.aboutTeam : grantApplication.aboutTeam;
      grantApplication.teamMembers = grantData.teamMembers ? grantData.teamMembers : grantApplication.teamMembers;
      grantApplication.hasPreviouslyReceivedFundingTokensGrantsFromNear = grantData.hasPreviouslyReceivedFundingTokensGrantsFromNear
        ? grantData.hasPreviouslyReceivedFundingTokensGrantsFromNear
        : grantApplication.hasPreviouslyReceivedFundingTokensGrantsFromNear;
      grantApplication.aboutTokensReceivedFromNear = grantData.aboutTokensReceivedFromNear ? grantData.aboutTokensReceivedFromNear : grantApplication.aboutTokensReceivedFromNear;
      grantApplication.projectName = grantData.projectName ? grantData.projectName : grantApplication.projectName;
      grantApplication.grantType = grantData.grantType ? grantData.grantType : grantApplication.grantType;
      grantApplication.grantCategory = grantData.grantCategory ? grantData.grantCategory : grantApplication.grantCategory;
      grantApplication.projectUrl = grantData.projectUrl ? grantData.projectUrl : grantApplication.projectUrl;
      grantApplication.githubUrl = grantData.githubUrl ? grantData.githubUrl : grantApplication.githubUrl;
      grantApplication.projectStatus = grantData.projectStatus ? grantData.projectStatus : grantApplication.projectStatus;
      grantApplication.projectLaunchDate = grantData.projectLaunchDate ? grantData.projectLaunchDate : grantApplication.projectLaunchDate;
      grantApplication.projectDescription = grantData.projectDescription ? grantData.projectDescription : grantApplication.projectDescription;
      grantApplication.currency = grantData.currency ? grantData.currency : grantApplication.currency;
      grantApplication.fundingAmount = grantData.fundingAmount ? grantData.fundingAmount : grantApplication.fundingAmount;
      grantApplication.nearFundingAmount = grantData.nearFundingAmount ? grantData.nearFundingAmount : grantApplication.nearFundingAmount;
      grantApplication.whatAndWhy = grantData.whatAndWhy ? grantData.whatAndWhy : grantApplication.whatAndWhy;
      grantApplication.competitionDifference = grantData.competitionDifference ? grantData.competitionDifference : grantApplication.competitionDifference;
      grantApplication.openSourceState = grantData.openSourceState ? grantData.openSourceState : grantApplication.openSourceState;
      grantApplication.opensourceComponentUse = grantData.opensourceComponentUse ? grantData.opensourceComponentUse : grantApplication.opensourceComponentUse;
      grantApplication.impactOnEcosystem = grantData.impactOnEcosystem ? grantData.impactOnEcosystem : grantApplication.impactOnEcosystem;
      grantApplication.excitementNear = grantData.excitementNear ? grantData.excitementNear : grantApplication.excitementNear;
      grantApplication.successMesurement = grantData.successMesurement ? grantData.successMesurement : grantApplication.successMesurement;
      grantApplication.projectRaisingRound = grantData.projectRaisingRound ? grantData.projectRaisingRound : grantApplication.projectRaisingRound;
      grantApplication.attachment = grantData.attachment ? grantData.attachment : grantApplication.attachment;
      grantApplication.addressCountry = grantData.addressCountry ? grantData.addressCountry : grantApplication.addressCountry;
      grantApplication.addressCity = grantData.addressCity ? grantData.addressCity : grantApplication.addressCity;
      grantApplication.addressStreet = grantData.addressStreet ? grantData.addressStreet : grantApplication.addressStreet;
      grantApplication.addressZip = grantData.addressZip ? grantData.addressZip : grantApplication.addressZip;
      grantApplication.howHeardGrants = grantData.howHeardGrants ? grantData.howHeardGrants : grantApplication.howHeardGrants;
      grantApplication.referral = grantData.referral ? grantData.referral : grantApplication.referral;
      grantApplication.teamReferral = grantData.teamReferral ? grantData.teamReferral : grantApplication.teamReferral;
      grantApplication.comments = grantData.comments ? grantData.comments : grantApplication.comments;
      grantApplication.milestones = grantData.milestones ? grantData.milestones : grantApplication.milestones;
      grantApplication.dateLastDraftSaving = new Date();

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
  submit() {},
};
