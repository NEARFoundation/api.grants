const getNearConfig = (keyStore, networkId = 'testnet') => ({
  keyStore,
  networkId,
  nodeUrl: `https://rpc.${networkId}.near.org`,
  walletUrl: `https://wallet.${networkId}.near.org`,
  helperUrl: `https://helper.${networkId}.near.org`,
  headers: {},
});

module.exports = getNearConfig;
