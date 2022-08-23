const configMap = new Map([
  [
    'testnet',
    {
      contractId: 'app.kycdao.testnet',
    },
  ],
  [
    'mainnet',
    {
      contractId: 'app.kycdao.near',
    },
  ],
]);

const config = {
  get(networkId) {
    return configMap.get(networkId);
  },
};

module.exports = config;
