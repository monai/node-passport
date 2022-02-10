/* eslint-disable no-underscore-dangle */
import * as boolean from './boolean.mjs';
import * as integer from './integer.mjs';
import * as bitString from './bit_string.mjs';
import * as nill from './null.mjs';
import * as objectIdentifier from './object_identifier.mjs';
import * as utf8String from './utf8_string.mjs';
import * as utcTime from './utc_time.mjs';
import * as bmpString from './bmp_string.mjs';

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
