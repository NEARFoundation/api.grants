const config = {
  skipOnboarding: process.env.SKIP_ONBOARDING.toLocaleLowerCase() === 'true',
};

module.exports = config;
