// ETSI TS 101 220 V16.0.0 (2021-04)

import controlReferenceAuthentication from '../../iso7816/templates/control_reference/authentication.mjs';

// 7.2 Assigned TLV tag values
// Table 7.10
const template = {
  // Access Mode data objects
  0x80: {
    description: 'Access Mode - Generic Command',
  },
  0x81: {
    description: 'Access Mode - Command Description',
  },
  0x82: {
    description: 'Access Mode - Command Description',
  },
  0x83: {
    description: 'Access Mode - Command Description',
  },
  0x84: {
    description: 'Access Mode - Command Description',
  },
  0x85: {
    description: 'Access Mode - Command Description',
  },
  0x86: {
    description: 'Access Mode - Command Description',
  },
  0x87: {
    description: 'Access Mode - Command Description',
  },
  0x88: {
    description: 'Access Mode - Command Description',
  },
  0x89: {
    description: 'Access Mode - Command Description',
  },
  0x8A: {
    description: 'Access Mode - Command Description',
  },
  0x8B: {
    description: 'Access Mode - Command Description',
  },
  0x8C: {
    description: 'Access Mode - Command Description',
  },
  0x8D: {
    description: 'Access Mode - Command Description',
  },
  0x8E: {
    description: 'Access Mode - Command Description',
  },
  0x8F: {
    description: 'Access Mode - Command Description',
  },
  0x9C: {
    description: 'Proprietary State Machine',
  },
  // Security Condition data objects
  0x90: {
    description: 'Security Condition - ALWAYS',
  },
  0x97: {
    description: 'Security Condition - NEVER',
  },
  0x9E: {
    description: 'Security Condition - Security Condition Byte',
  },
  0xA4: {
    description: 'Control reference Template',
    children: controlReferenceAuthentication,
  },
  0xA0: {
    description: 'Security Condition - OR Template',
  },
  0xAF: {
    description: 'Security Condition - AND Template',
  },
};

export default template;
