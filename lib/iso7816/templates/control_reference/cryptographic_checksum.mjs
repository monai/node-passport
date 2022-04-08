// BS ISO/IEC 7816-4:2013

import * as usageQualifierByte from './usage_qualifier_byte/cryptographic_checksum.mjs';

// Table 55 — Control reference DOs in control reference templates
const template = {
  0x80: {
    description: 'Cryptographic mechanism reference',
  },
  0x81: {
    description: 'File reference',
  },
  0x82: {
    description: 'DF name',
  },
  0x83: {
    description: 'Reference of a secret key (for direct use)',
  },
  0x84: {
    description: 'Reference for computing a session key',
  },
  0xA3: {
    description: 'Key usage template',
  },
  0x85: {
    description: 'null block',
  },
  0x86: {
    description: 'chaining block',
  },
  0x87: (node) => ({
    description: node.length > 0 ? 'initial value block' : 'previous initial value block plus one',
  }),
  0x88: {
    description: 'previous exchanged challenge plus one',
  },
  0x89: (node) => ({
    description: node.length > 0 ? 'value of a proprietary data element' : 'index of a proprietary data element',
  }),
  0x8A: (node) => ({
    description: node.length > 0 ? 'value of a proprietary data element' : 'index of a proprietary data element',
  }),
  0x8B: (node) => ({
    description: node.length > 0 ? 'value of a proprietary data element' : 'index of a proprietary data element',
  }),
  0x8C: (node) => ({
    description: node.length > 0 ? 'value of a proprietary data element' : 'index of a proprietary data element',
  }),
  0x8D: (node) => ({
    description: node.length > 0 ? 'value of a proprietary data element' : 'index of a proprietary data element',
  }),
  0x91: {
    description: 'random number provided by the card',
  },
  0x94: {
    description: 'Challenge or data element for deriving a key',
  },
  0x95: {
    description: 'Usage qualifier byte',
    ...usageQualifierByte,
  },
};

export default template;
