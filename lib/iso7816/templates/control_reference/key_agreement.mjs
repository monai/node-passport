// BS ISO/IEC 7816-4:2013

import * as usageQualifierByte from '../../dos/security_attributes/usage_qualifier_byte/key_agreement.mjs';

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
    description: 'Reference of a secret key (for direct use) / of a public key',
  },
  0x84: {
    description: 'Reference for computing a session key / of a private key',
  },
  0xA3: {
    description: 'Key usage template',
  },
  0x91: {
    description: (node) => (node.length > 0 ? 'random number' : 'random number provided by the card'),
  },
  0x95: {
    description: 'Usage qualifier byte',
    ...usageQualifierByte,
  },
};

export default template;
