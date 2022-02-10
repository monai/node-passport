// ETSI TS 101 220 V16.0.0 (2021-04)

import discretionary from './discretionary_template.js';

// 7.2 Assigned TLV tag values
// Table 7.14
const template = {
  0x4F: {
    description: 'Application Identifier (AID)',
  },
  0x50: {
    description: 'Application Label',
  },
  0x51: {
    description: 'Path',
  },
  0x52: {
    description: 'Command to Perform',
  },
  0x53: {
    description: 'Discretionary Data',
  },
  0x73: {
    description: 'Discretionary Template',
    children: discretionary,
  },
  0x5F50: {
    description: 'Uniform Resource Locator (URL)',
  },
};

export default template;
