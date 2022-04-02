// ETSI TS 101 220 V16.0.0 (2021-04)

import application from './application.mjs';
import fcp from './file_control_information/fcp.mjs';

// 7.2 Assigned TLV tag values
// Table 7.8
const template = {
  0x61: {
    name: 'application',
    description: 'Application Template',
    children: application,
  },
  0x62: {
    name: 'fcp',
    description: 'FCP Template',
    children: fcp,
  },
  0x7B: {
    name: 'securityEnvironment',
    description: 'Security Environment Template',
  },
};

export default template;
