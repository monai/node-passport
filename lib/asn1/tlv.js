const { encode } = require('./length');

module.exports = tlv;

function tlv(tag, data) {
  return Buffer.concat([
    Buffer.from([tag]),
    encode(data.length),
    data,
  ]);
}
