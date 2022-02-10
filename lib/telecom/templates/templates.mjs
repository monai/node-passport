// ETSI TS 101 220 V16.0.0 (2021-04)

import application from './application_template.mjs';
import fcp from './fcp_template.mjs';

// 7.2 Assigned TLV tag values
// Table 7.8
const template = {
  0x61: {
    description: 'Application Template',
    children: application,
  },
  0x62: {
    description: 'FCP Template',
    children: fcp,
  },
  0x7B: {
    description: 'Security Environment Template',
  },
};

export default template;
