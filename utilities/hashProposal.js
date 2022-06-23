const sha256 = require('./sha256')

// grantPaymentNumber = 0 for initial payment, 1 for milestone 1, ...
const hashProposal = (salt, accountId, amount, grantPaymentNumber) => {
	return sha256.hash(`${salt}.${accountId}.${amount}.${grantPaymentNumber}`);
}

module.exports = hashProposal;