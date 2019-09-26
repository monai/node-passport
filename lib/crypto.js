const crypto = require('crypto');

module.exports = {
  createCipher,
  createDecipher
};

function createCipher(algorithm, key, iv) {
  return (message) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    return Buffer.concat([cipher.update(message), cipher.final()]);
  }
}

function createDecipher(algorithm, key, iv) {
  return (message) => {
    const decipher = crypto.createCipheriv(algorithm, key, iv);
    return Buffer.concat([decipher.update(message), decipher.final()]);
  }
}
