/*
    This file is a copy of https://github.com/NEAR-labs/ui.fund3r/blob/master/form-schemas/grantApplicationFormSchema.ts
    Where z.nativeEnum has been replaced by z.enum
    ES6 import/export replaced by CommonJS require/module.exports
    Adding preprocess for dates
*/

const { z } = require('zod');
const Countries = require('@kycdao/kycdao-sdk/dist/countries.list.json');

const countryCodes = Countries.map((country) => country.iso_cca2);

const preprocessDate = (arg) => {
  if (typeof arg === 'string' || arg instanceof Date) {
    return new Date(arg);
  }

  return arg;
};

// eslint-disable-next-line max-lines-per-function
const createSchema = (t) =>
  z.object({
    projectName: z.string().min(1, { message: t('form.projectName.error') }),
    grantType: z.enum(['equity', 'non-equity'], {
      errorMap: () => ({ message: t('form.grantType.error') }),
    }),
    grantCategory: z.enum(['channel-brand-partnership', 'daos', 'gaming-metaverse', 'infrastructure-wallets', 'institutional-financial', 'nfts', 'social-impact', 'other'], {
      errorMap: () => ({ message: t('form.grantCategory.error') }),
    }),
    projectUrl: z.string({ required_error: t('form.projectUrl.error') }).url({ message: t('form.projectUrl.error') }),
    githubUrl: z.string({ required_error: t('form.githubUrl.error') }).url({ message: t('form.githubUrl.error') }),
    projectStatus: z.enum(['mvp', 'pre-alpha', 'alpha', 'beta', 'live'], {
      errorMap: () => ({ message: t('form.projectStatus.error') }),
    }),
    projectLaunchDate: z.preprocess(preprocessDate, z.date({ required_error: t('form.projectLaunchDate.error'), invalid_type_error: t('form.projectLaunchDate.error') })),
    projectDescription: z
      .string({ required_error: t('form.projectDescription.error') })
      .min(1, { message: t('form.projectDescription.error') })
      .max(100, { message: t('form.projectDescription.error') }),
    fundingAmount: z
      .number({ invalid_type_error: t('form.fundingAmount.error'), required_error: t('form.fundingAmount.error') })
      .min(1, { message: t('form.fundingAmount.error') })
      .describe(t('form.fundingAmount.description')),

    milestones: z.array(
      z.object({
        budget: z.number({ invalid_type_error: t('form.budget.error'), required_error: t('form.budget.error') }).min(1, { message: t('form.budget.error') }),
        deliveryDate: z.preprocess(preprocessDate, z.date({ invalid_type_error: t('form.deliveryDate.error'), required_error: t('form.deliveryDate.error') })),
        description: z
          .string({ required_error: t('form.milestoneDescription.error') })
          .min(1, { message: t('form.milestoneDescription.error') })
          .max(100, { message: t('form.milestoneDescription.error') }),
      }),
    ),

    whatAndWhy: z
      .string({ required_error: t('form.whatAndWhy.error') })
      .min(1, { message: t('form.whatAndWhy.error') })
      .max(100, { message: t('form.whatAndWhy.error') }),
    competitionDifference: z
      .string({ required_error: t('form.competitionDifference.error') })
      .min(1, { message: t('form.competitionDifference.error') })
      .max(100, { message: t('form.competitionDifference.error') }),
    openSourceState: z.enum(['fully-open-source', 'partially-open-source', 'closed-source'], {
      errorMap: () => ({ message: t('form.openSourceState.error') }),
    }),
    opensourceComponentUse: z
      .string({ required_error: t('form.opensourceComponentUse.error') })
      .min(1, { message: t('form.opensourceComponentUse.error') })
      .describe(t('form.opensourceComponentUse.description')),
    impactOnEcosystem: z
      .string({ required_error: t('form.impactOnEcosystem.error') })
      .min(1, { message: t('form.impactOnEcosystem.error') })
      .max(1000, { message: t('form.impactOnEcosystem.error') }),
    excitementNear: z
      .string({ required_error: t('form.excitementNear.error') })
      .min(1, { message: t('form.excitementNear.error') })
      .max(1000, { message: t('form.excitementNear.error') }),
    successMesurement: z
      .string({ required_error: t('form.successMesurement.error') })
      .min(1, { message: t('form.successMesurement.error') })
      .describe(t('form.successMesurement.description')),
    projectRaisingRound: z.enum(['raising', 'not-raising'], {
      errorMap: () => ({ message: t('form.projectRaisingRound.error') }),
    }),
    attachment: z.string({ required_error: t('form.attachment.error') }).optional(),

    firstname: z.string({ required_error: t('form.firstname.error') }).min(1, { message: t('form.firstname.error') }),
    lastname: z.string({ required_error: t('form.lastname.error') }).min(1, { message: t('form.lastname.error') }),
    dateOfBirth: z.preprocess(preprocessDate, z.date({ required_error: t('form.dateOfBirth.error'), invalid_type_error: t('form.dateOfBirth.error') })),
    email: z.string({ required_error: t('form.email.error') }).email({ message: t('form.email.error') }),
    github: z.string().optional(),
    twitter: z.string().optional(),
    workingAloneOrTeam: z.enum(['working-alone', 'working-with-team'], {
      errorMap: () => ({ message: t('form.workingAloneOrTeam.error') }),
    }),
    aboutTeam: z
      .string({ required_error: t('form.aboutTeam.error') })
      .nullable()
      .optional(),
    teamMembers: z.array(
      z.object({
        githubUrl: z.string().url({ message: t('form.githubUrl.error') }),
      }),
    ),

    hasPreviouslyReceivedFundingTokensGrantsFromNear: z.boolean(),
    aboutTokensReceivedFromNear: z.string().optional(),

    addressCountry: z.enum(countryCodes),
    addressCity: z.string({ required_error: t('form.addressCity.error') }).min(1, { message: t('form.addressCity.error') }),
    addressStreet: z.string({ required_error: t('form.addressStreet.error') }).min(1, { message: t('form.addressStreet.error') }),
    addressZip: z.string({ required_error: t('form.addressZip.error') }).min(1, { message: t('form.addressZip.error') }),

    howHeardGrants: z
      .string({ required_error: t('form.howHeardGrants.error') })
      .min(1, { message: t('form.howHeardGrants.error') })
      .describe(t('form.howHeardGrants.description')),
    referral: z.string().optional(),
    teamReferral: z.string().optional(), // to update with an enum
    comments: z
      .string()
      .max(1000, { message: t('form.comments.error') })
      .optional(),
  });

module.exports = createSchema;
