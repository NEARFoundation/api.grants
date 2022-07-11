const configMap = new Map([
  [
    'testnet',
    {
      contractId: 'app.kycdao.testnet',
    },
  ],
]);

const config = {
  get(networkId) {
    return configMap.get(networkId);
  },
};

module.exports = config;
