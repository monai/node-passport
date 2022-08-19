// ISO/IEC 7816-4:2013

import application from './application.mjs';

// 12.2.4 Application template and related data elements
// Table 122
const template = {
  0x61: {
    description: 'Application template',
    children: application,
  },
};

export default template;
