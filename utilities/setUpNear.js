const nearApi = require('near-api-js');
const getNearConfig = require('./getNearConfig');
const logger = require('./logger');

const setUpNear = async () => {
  const network = process.env.NEAR_NETWORK_ENV;
  logger.info(`[Near] Setting up near api js - network ${network}`);

  const keyPair = nearApi.utils.key_pair.KeyPairEd25519.fromRandom();
  const keyStore = new nearApi.keyStores.InMemoryKeyStore();

  const nearConfig = getNearConfig(keyStore, network);
  const near = await nearApi.connect(nearConfig);

  const account = await near.account('testnet');

  const setup = {
    near,
    keyPair,
    account,
  };

  return setup;
};

module.exports = setUpNear;
