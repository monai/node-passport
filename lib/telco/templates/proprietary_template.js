// ETSI TS 101 220 V16.0.0 (2021-04)

// 7.2 Assigned TLV tag values
// Table 7.13
const template = {
  0x80: {
    description: 'UICC Characteristics',
  },
  0x81: {
    description: 'Application Power Consumption',
  },
  0x82: {
    description: 'Minimum Application Clock Freq.',
  },
  0x83: {
    description: 'Amount of Available Memory',
  },
  0x84: {
    description: 'File details',
  },
  0x85: {
    description: 'Reserved file size',
  },
  0x86: {
    description: 'Maximum file size',
  },
  0x87: {
    description: 'Supported system commands',
  },
  0x88: {
    description: 'Specific UICC environmental conditions',
  },
  0x89: {
    description: 'Platform to Platform CAT Secured APDU',
  },
  0xC0: {
    description: 'Special File Information',
  },
  0xC1: {
    description: 'Filling Pattern',
  },
  0xC2: {
    description: 'Repeat Pattern',
  },
};

module.exports = template;
