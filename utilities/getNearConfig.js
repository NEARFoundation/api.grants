const getNearConfig = (networkId = 'testnet') => ({
  networkId,
  nodeUrl: `https://rpc.${networkId}.near.org`,
  walletUrl: `https://wallet.${networkId}.near.org`,
  helperUrl: `https://helper.${networkId}.near.org`,
  headers: {},
});

module.exports = getNearConfig;
