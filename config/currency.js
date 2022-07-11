const getTokenId = (networkId = 'testnet') => {
  const tokenConfig = new Map([
    ['testnet', 'usdn.testnet'],
    ['mainnet', 'usn'],
  ]);

  return tokenConfig.get(networkId);
};

module.exports = getTokenId;
