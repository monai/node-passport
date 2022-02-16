// BS ISO/IEC 7816-4:2013

import fcp from './fcp.mjs';

// Table 8 — Interindustry templates for file control information
const template = {
  0x62: {
    description: 'Set of file control parameters (FCP template)',
    children: fcp,
  },
  0x64: {
    description: 'Set of file management data (FMD template)',
  },
  0x6F: {
    description: 'Set of file control parameters and file management data (FCI template)',
  },
};

export default template;
