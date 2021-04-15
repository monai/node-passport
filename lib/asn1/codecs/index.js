/* eslint-disable no-underscore-dangle */
const integer = require('./integer');
const bitString = require('./bitString');
const nill = require('./null.js');
const objectIdentifier = require('./objectIdentifier');
const utf8String = require('./utf8String');
const utcTime = require('./utcTime');
const bmpString = require('./bmpString');

module.exports = {
  2: integer,
  3: bitString,
  5: nill,
  6: objectIdentifier,
  12: utf8String,
  23: utcTime,
  30: bmpString,
};
