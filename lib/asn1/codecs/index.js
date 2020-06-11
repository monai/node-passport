const integer = require('./integer');
const bitString = require('./bitString');
const octetString = require('./octetString');
const utf8String = require('./utf8String');
const sequence = require('./sequence');

module.exports = {
  // 2: integer,
  3: bitString,
  // 4: octetString,
  // 12: utf8String,
  // 30: sequence,
};
