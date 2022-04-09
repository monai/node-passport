// BS ISO/IEC 7816-4:2013

import file from './file.mjs';
import { decode as inspectInteger } from '../../../dos/unsigned_integer.mjs';
import { decode as inspectHexString } from '../../../dos/hex_string.mjs';

// Table 10 — Control parameter data objects
const own = {
  0x80: {
    name: 'dataLength',
    description: 'Number of data bytes (excluding structural)',
    decode: inspectInteger,
  },
  0x88: {
    name: 'shortFileIdentifier',
    description: 'Short EF identifier',
    inspect: inspectHexString,
  },
  0x8f: {
    description: 'Profile indicator',
  },
  0x92: {
    description: 'Data descriptor',
  },
};

export default {
  ...file,
  ...own,
};

export const dos = Object.keys(own);
