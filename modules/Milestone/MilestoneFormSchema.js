/*
    This file is a copy of https://github.com/NEAR-labs/ui.fund3r/blob/master/form-schemas/milestoneSubmissionFormSchema.ts
    And where types has been removed and t has been mocked
    ES6 import/export replaced by CommonJS require/module.exports
*/

const { z } = require('zod');

const createSchema = (t) => {
  const schema = z.object({
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
