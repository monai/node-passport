// ETSI TS 123 040 V16.0.0 (2020-07)

const { decode: decodeNumeric } = require('./numeric');

module.exports = {
  decode,
};

// 9.1.2.1 Integer representation
function decode(data) {
  return decodeNumeric(data);
}
