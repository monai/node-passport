const { writeUIntBE } = require('../util');
const { encode } = require('./length');

module.exports = tlv;

function tlv(tag, data) {
  const n = Math.ceil(Math.log2(tag + 1) / 8);
  const tagBuf = Buffer.alloc(n);
  writeUIntBE(tagBuf, tag);

  return Buffer.concat([
    tagBuf,
    encode(data?.length || 0),
    data,
  ].filter(Boolean));
}
