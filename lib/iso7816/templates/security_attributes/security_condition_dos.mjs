// BS ISO/IEC 7816-4:2013

import controlReference from '../control_reference/index.mjs';

// Table 33 — Coding of security condition DOs
const template = {
  0x90: {
    description: 'Always',
  },
  0x97: {
    description: 'Never',
  },
  0x9D: {
    description: 'Security condition byte',
  },
  0x9E: {
    description: 'Security condition byte',
  },
  0xA4: controlReference[0xA4],
  0xAB: {
    description: 'Object status condition template',
  },
  0xB4: controlReference[0xB4],
  0xB6: controlReference[0xB6],
  0xB8: controlReference[0xB8],
  0xA0: {
    description: 'Security condition DOs (OR template)',
  },
  0xA7: {
    description: 'Security condition DOs (NOT template)',
  },
  0xAF: {
    description: 'Security condition DOs (AND template)',
  },
  0xBE: {
    description: 'Security condition template',
  },
};

export default template;
