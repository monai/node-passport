// ETSI TS 101 220 V16.0.0 (2021-04)

const securityAttribute = require('./security_attribute_template');
const proprietary = require('./proprietary_template');
const pinStatus = require('./pin_status_dos');

// 7.2 Assigned TLV tag values
// Table 7.9
const template = {
  0x80: {
    description: 'File Size - Data',
  },
  0x81: {
    description: 'File Size - Total',
  },
  0x82: {
    description: 'File Descriptor',
  },
  0x83: {
    description: 'File Identifier',
  },
  0x84: {
    description: 'DF Name (AID)',
  },
  0x85: {
    description: 'Proprietary - Primitive',
  },
  0x88: {
    description: 'SFI Support',
  },
  0x8A: {
    description: 'Life Cycle Status',
  },
  // Security attribute data object
  0x8B: {
    description: 'Security Attribute - Reference Format',
  },
  0x8C: {
    description: 'Security Attribute - Compact Format',
  },
  0xAB: {
    description: 'Security Attribute Template - Expanded Format',
    children: securityAttribute,
  },
  // Proprietary template
  0xA5: {
    description: 'Proprietary Template',
    children: proprietary,
  },
  // PIN Status data objects
  0xC6: {
    description: 'PIN Status data objects',
    children: pinStatus,
  },
};

module.exports = template;
