const crypto = require('crypto');

const sha256 = {
	hash: (input) => {
		return crypto.createHash('sha256').update(input).digest('hex');
	}
}

module.exports = sha256;