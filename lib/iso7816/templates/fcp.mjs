// BS ISO/IEC 7816-4:2013

import { decode as decodeLifeCycleStatus } from '../dos/fcp/life_cycle_status.mjs';
import { decode as decodeFileDescriptor } from '../dos/fcp/file_descriptor.mjs';
import { decode as inspectInteger } from '../dos/unsigned_integer.mjs';
import { decode as inspectHexString } from '../dos/hex_string.mjs';

// Table 10 — Control parameter data objects
const template = {
  0x80: {
    name: 'dataLength',
    description: 'Number of data bytes (excluding structural)',
    inspect: inspectInteger,
  },
  0x81: {
    name: 'totalLength',
    description: 'Number of data bytes (including structural)',
    inspect: inspectInteger,
  },
  0x82: {
    name: 'fileDescriptor',
    description: 'File descriptor',
    decode: decodeFileDescriptor,
  },
  0x83: {
    name: 'fileIdentifier',
    description: 'File identifier',
    inspect: inspectHexString,
  },
  0x84: {
    name: 'dfName',
    description: 'DF name',
    inspect: inspectHexString,
  },
  0x85: {
    description: 'Proprietary information',
  },
  0x86: {
    description: 'Security attributes in proprietary format',
  },
  0x87: {
    description: 'FCI extensions EF identifier',
  },
  0x88: {
    name: 'shortFileIdentifier',
    description: 'Short EF identifier',
    inspect: inspectHexString,
  },
  0x8a: {
    name: 'lifeCycleStatus',
    description: 'Life cycle status',
    decode: decodeLifeCycleStatus,
  },
  0x8b: {
    description: 'Security attribute in extended format',
  },
  0x8c: {
    description: 'Security attribute in compact format, SE oriented',
  },
  0x8d: {
    description: 'Identifier of an EF containing SE templates',
  },
  0x8e: {
    description: 'Logical channel security attribute',
  },
  0x8f: {
    description: 'Profile indicator',
  },
  0x92: {
    description: 'Data descriptor',
  },
  0x96: {
    description: 'as defined in ISO/IEC 7816-11',
  },
  0x97: {
    description: 'DF list',
  },
  0x98: {
    description: 'Instance number',
  },
  0x99: {
    description: 'Number of DOs in the current template after file or DO selection',
  },
  0x9a: {
    description: 'Number of EFs within a DF',
  },
  0x9b: {
    description: 'EF list',
  },
  0x9c: {
    description: 'Security attribute in compact format, SPT oriented',
  },
  0x9d: {
    description: 'Tag of the DO(s) to which DO\'62\' applies',
  },
  0xa0: {
    description: 'Security attribute template for DOs',
  },
  0xa1: {
    description: 'Security attribute template in proprietary format',
  },
  0xa2: {
    description: 'TODO',
  },
  0xa3: {
    description: 'Interface and LCS dependent security attribute template',
  },
  0xa5: {
    description: 'Proprietary information encoded in BER-TLV',
  },
  0xa6: {
    description: 'as defined in ISO/IEC 7816-11',
  },
  0xab: {
    description: 'Security attribute template in expanded format',
  },
  0xac: {
    description: 'Cryptographic mechanism identifier template',
  },
  0xad: {
    description: 'Security parameters template',
  },
  0xaf: {
    description: 'Template encapsulating one or more DO\'06\' (OID) relevant to the application',
  },
};

export default template;
