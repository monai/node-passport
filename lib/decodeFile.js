const { decode: decodeTag } = require('./asn1/tag');
const { decode: decodeLength } = require('./asn1/length');

module.exports = decodeFile;

const classes = [
  'Universal',
  'Application',
  'Context-specific',
  'Private',
];

function decodeFile(data) {
  let rl, klass, encoding, number, length;
  let offset = 0;

  [klass, encoding, number, length, rl] = readNext(data, offset);
  offset += rl;
  console.log('-', klass, number.toString(16), length);

  [klass, encoding, number, length, rl] = readNext(data, offset);
  offset += rl + length;
  console.log('-', klass, number.toString(16), length);

  [klass, encoding, number, length, rl] = readNext(data, offset);
  offset += rl + length;
  console.log('-', klass, number.toString(16), length);

  [klass, encoding, number, length, rl] = readNext(data, offset);
  offset += rl;
  console.log('-', klass, number.toString(16), length, data.slice(offset));
}

function readNext(data, offset) {
  let rl, klass, encoding, number, length;
  let offset_ = offset;

  [klass, encoding, number, rl] = decodeTag(data.slice(offset_));
  offset_ += rl;
  [length, rl] = decodeLength(data.slice(offset_));
  offset_ += rl;

  return [klass, encoding, number, length, offset_ - offset];
}
