const tlv = require('../asn1/tlv');
const { encode: encodeLength } = require('../asn1/length');

module.exports = {
  buildDo87,
  buildDo8e: createFn(0x8e),
  buildDo97: createFn(0x97),
};

function buildDo87(padding, data) {
  return Buffer.concat([
    Buffer.from([0x87]),
    encodeLength(data.length + 1),
    Buffer.from([padding]),
    data,
  ]);
}

function createFn(tag) {
  return (data) => tlv(tag, data);
}
