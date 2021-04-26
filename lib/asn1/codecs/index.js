/* eslint-disable no-underscore-dangle */
const integer = require('./integer');
const bitString = require('./bit_string');
const nill = require('./null.js');
const objectIdentifier = require('./object_identifier');
const utf8String = require('./utf8_string');
const utcTime = require('./utc_time');
const bmpString = require('./bmp_string');

module.exports = {
  2: integer,
  3: bitString,
  5: nill,
  6: objectIdentifier,
  12: utf8String,
  23: utcTime,
  30: bmpString,
};
