const integer = require('./integer');
const bitString = require('./bitString');
const objectIdentifier = require('./objectIdentifier');
const utf8String = require('./utf8String');
const utcTime = require('./utcTime');

module.exports = {
  2: integer,
  3: bitString,
  6: objectIdentifier,
  12: utf8String,
  23: utcTime,
};
