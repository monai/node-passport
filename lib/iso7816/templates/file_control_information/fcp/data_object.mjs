// BS ISO/IEC 7816-4:2013

import fileOrDataObject from './file_or_data_object.mjs';

// Table 10 — Control parameter data objects
const own = {
  0x92: {
    description: 'Data descriptor',
  },
  0x98: {
    description: 'Instance number',
  },
  0x9d: {
    description: 'Tag of the DO(s) to which DO\'62\' applies',
  },
  0xad: {
    description: 'Security parameters template',
  },
};

export default {
  ...fileOrDataObject,
  ...own,
};

export const dos = Object.keys(own);
