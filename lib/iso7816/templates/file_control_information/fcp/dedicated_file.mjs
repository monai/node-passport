// BS ISO/IEC 7816-4:2013

import file from './file.mjs';
import { decode as inspectHexString } from '../../../dos/hex_string.mjs';

// Table 10 — Control parameter data objects
const own = {
  0x84: {
    name: 'dfName',
    description: 'DF name',
    inspect: inspectHexString,
  },
  0x87: {
    description: 'FCI extensions EF identifier',
  },
  0x8d: {
    description: 'Identifier of an EF containing SE templates',
  },
  0x96: {
    description: 'as defined in ISO/IEC 7816-11',
  },
  0x97: {
    description: 'DF list',
  },
  0x9a: {
    description: 'Number of EFs within a DF',
  },
  0x9b: {
    description: 'EF list',
  },
  0xa2: {
    description: 'TODO',
  },
  0xa6: {
    description: 'as defined in ISO/IEC 7816-11',
  },
  0xac: {
    description: 'Cryptographic mechanism identifier template',
  },
  0xaf: {
    description: 'Template encapsulating one or more DO\'06\' (OID) relevant to the application',
  },
};

export default {
  ...file,
  ...own,
};

export const dos = Object.keys(own);
