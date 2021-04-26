const crypto = require('crypto');

module.exports = deriveKey;

function deriveKey(can, suffix) {
  const suf = Buffer.alloc(4);
  suf.writeUInt32BE(suffix);

  const hash = crypto.createHash('sha1');
  hash.update(Buffer.concat([can, suf]));
  return hash.digest().slice(0, 0x10);
}
