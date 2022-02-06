// ETSI TS 101 220 V16.0.0 (2021-04)

const application = require('./application_template');
const fcp = require('./fcp_template');

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

module.exports = template;
