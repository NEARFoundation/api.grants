const config = {
  skipEvaluationApproval: process.env.SKIP_EVALUATION_APPROVAL.toLocaleLowerCase() === 'true',
  skipOnboarding: process.env.SKIP_ONBOARDING.toLocaleLowerCase() === 'true',
  defaultCurrency: process.env.DEFAULT_CURRENCY || 'USN',
};

module.exports = config;
