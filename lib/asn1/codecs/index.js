/* eslint-disable no-underscore-dangle */
import * as boolean from './boolean.js';
import * as integer from './integer.js';
import * as bitString from './bit_string.js';
import * as nill from './null.js';
import * as objectIdentifier from './object_identifier.js';
import * as utf8String from './utf8_string.js';
import * as utcTime from './utc_time.js';
import * as bmpString from './bmp_string.js';

export default {
  1: boolean,
  2: integer,
  3: bitString,
  5: nill,
  6: objectIdentifier,
  12: utf8String,
  23: utcTime,
  30: bmpString,
};
