// BS ISO/IEC 7816-4:2013

import * as usageQualifierByte from './usage_qualifier_byte/confidentiality.mjs';

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
    description: 'Reference of a public key',
  },
  0x84: {
    description: 'Reference of a private key',
  },
  0xA3: {
    description: 'Key usage template',
  },
  0x88: {
    description: 'previous exchanged challenge plus one',
  },
  0x91: {
    description: (node) => (node.length > 0 ? 'random number' : 'random number provided by the card'),
  },
  0x92: {
    description: (node) => (node.length > 0 ? 'time stamp' : 'time stamp provided by the card'),
  },
  0x93: {
    description: (node) => (node.length > 0 ? 'digital signature counter' : 'previous digital signature counter plus one'),
  },
  0x95: {
    description: 'Usage qualifier byte',
    ...usageQualifierByte,
  },
  0x8E: {
    description: 'Cryptogram content reference',
  },
};

export default template;
