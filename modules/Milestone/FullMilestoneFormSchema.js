/*
    This file is a copy of https://github.com/NEAR-labs/ui.fund3r/blob/master/form-schemas/fullMilestoneSubmissionFormSchema.ts
    And where types has been removed and t has been mocked
    ES6 import/export replaced by CommonJS require/module.exports
*/

const { z } = require('zod');

const preprocessDate = (arg) => {
  if (typeof arg === 'string' || arg instanceof Date) {
    return new Date(arg);
  }

  return arg;
};

const createSchema = (t) => {
  const schema = z.object({
    budget: z.number({ invalid_type_error: t('form.budget.error'), required_error: t('form.budget.error') }).min(1, { message: t('form.budget.error') }),
    deliveryDate: z.preprocess(preprocessDate, z.date({ invalid_type_error: t('form.deliveryDate.error'), required_error: t('form.deliveryDate.error') })),
    description: z
      .string({ required_error: t('form.milestoneDescription.error') })
      .min(1, { message: t('form.milestoneDescription.error') })
      .max(100, { message: t('form.milestoneDescription.error') }),
    githubUrl: z.string({ required_error: t('form.githubUrl.error') }).url({ message: t('form.githubUrl.error') }),
    attachment: z
      .string({ required_error: t('form.attachment.error') })
      .url({ message: t('form.attachment.error') })
      .optional(),
    comments: z.string().optional(),
  });

  return schema;
};

module.exports = createSchema;
