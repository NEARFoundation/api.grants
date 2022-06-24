const config = {
  skipOnboarding: process.env.SKIP_ONBOARDING.toLocaleLowerCase() === 'true',
  defaultCurrency: process.env.DEFAULT_CURRENCY || 'USN',
};

module.exports = config;
