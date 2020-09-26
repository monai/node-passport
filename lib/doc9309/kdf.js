const crypto = require('crypto');

// Doc 9309-11 9.7.1.1, 9.7.1.2
const modes = {
  'des-ede3-cbc': {
    hash: 'sha1',
    length: 16,
  },
  'aes-128-cbc': {
    hash: 'sha1',
    length: 16,
  },
  'aes-192-cbc': {
    hash: 'sha256',
    length: 24,
  },
  'aes-256-cbc': {
    hash: 'sha256',
    length: 32,
  },
};

module.exports = {
  modes,
  kdf,
};

// Doc 9309-11 9.7
function kdf(k, c, mode) {
  mode = modes[mode];

  const cbuf = Buffer.alloc(4);
  cbuf.writeUInt32BE(c);

  const hash = crypto.createHash(mode.hash);
  hash.update(Buffer.concat([k, cbuf]));
  return hash.digest().slice(0, mode.length);
}
