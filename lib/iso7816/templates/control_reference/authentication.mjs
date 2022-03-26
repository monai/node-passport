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
    description: 'Reference of a secret key (for direct use) / of a public key / data',
  },
  0x84: {
    description: 'Reference for computing a session key / of a private key',
  },
  0xA3: {
    description: 'Key usage template',
  },
  0x94: {
    description: 'Challenge or data element for deriving a key',
  },
  0x95: {
    description: 'Usage qualifier byte',
  },
};

export default template;
