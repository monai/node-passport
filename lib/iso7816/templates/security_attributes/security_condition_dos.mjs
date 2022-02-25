// BS ISO/IEC 7816-4:2013

import controlReference from './control_reference.mjs';

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
  0xA4: {
    description: 'Control reference template (AT)',
    children: controlReference,
  },
  0xAB: {
    description: 'Object status condition template',
  },
  0xB4: {
    description: 'Control reference template (CCT)',
    children: controlReference,
  },
  0xB6: {
    description: 'Control reference template (DST)',
    children: controlReference,
  },
  0xB8: {
    description: 'Control reference template (CT)',
    children: controlReference,
  },
  0xA0: {
    description: 'Security condition DOs',
  },
  0xA7: {
    description: 'Security condition DOs',
  },
  0xAF: {
    description: 'Security condition DOs',
  },
  0xBE: {
    description: 'Security condition template',
  },
};

export default template;
