// BS ISO/IEC 7816-4:2013

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
  0x85: {
    description: 'null block',
  },
  0x86: {
    description: 'chaining block',
  },
  0x87: {
    description: 'previous initial value block plus one',
  },
  0x88: {
    description: 'previous exchanged challenge plus one',
  },
  0x89: {
    description: 'index of a proprietary data element',
  },
  0x8A: {
    description: 'index of a proprietary data element',
  },
  0x8B: {
    description: 'index of a proprietary data element',
  },
  0x8C: {
    description: 'index of a proprietary data element',
  },
  0x8D: {
    description: 'index of a proprietary data element',
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
  0x94: {
    description: 'Challenge or data element for deriving a key',
  },
  0x95: {
    description: 'Usage qualifier byte',
  },
  0x8E: {
    description: 'Cryptogram content reference',
  },
};

export default template;
