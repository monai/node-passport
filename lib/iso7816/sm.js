const tlv = require('../asn1/tlv');
const { encode: encodeLength } = require('../asn1/length');

module.exports = {
  buildDo87,
  buildDo8e: createFunction(0x8e),
  buildDo97: createFunction(0x97),
};

function buildDo87(padding, data) {
  return Buffer.concat([
    Buffer.from([0x87]),
    encodeLength(data.length + 1),
    Buffer.from([padding]),
    data,
  ]);
}

function createFunction(tag) {
  return (data) => tlv(tag, data);
}
