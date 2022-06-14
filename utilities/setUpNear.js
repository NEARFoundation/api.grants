const nearApi = require('near-api-js');
const getNearConfig = require('./getNearConfig');
const logger = require('./logger');

const setUpNear = async () => {
  const network = process.env.NEAR_NETWORK_ENV;
  logger.info(`[Near] Setting up near api js - network ${network}`);

  const nearConfig = getNearConfig(network);
  const keyPair = nearApi.utils.key_pair.KeyPairEd25519.fromRandom();

  const setup = {
    near: await nearApi.connect(nearConfig),
    keyPair,
  };

  return setup;
};

module.exports = setUpNear;
