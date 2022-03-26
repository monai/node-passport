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
    description: 'initial value block',
  },
  0x90: {
    description: 'hash-code provided by the card',
  },
  0x92: {
    description: 'time stamp provided by the card',
  },
  0x93: {
    description: 'previous digital signature counter plus one',
  },
};

export default template;
