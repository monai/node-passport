// BS ISO/IEC 7816-4:2013

import * as lifeCycleStatus from '../dos/life_cycle_status.mjs';
import { decode as inspectInteger } from '../../../dos/unsigned_integer.mjs';

// Table 10 — Control parameter data objects
const template = {
  0x81: {
    name: 'totalLength',
    description: 'Number of data bytes (including structural)',
    decode: inspectInteger,
  },
  0x8a: {
    name: 'lifeCycleStatus',
    description: 'Life cycle status',
    ...lifeCycleStatus,
  },
  0x8e: {
    description: 'Logical channel security attribute',
  },
  0x99: {
    description: 'Number of DOs in the current template after file or DO selection',
  },
  0x9c: {
    description: 'Security attribute in compact format, SPT oriented',
  },
  0xa0: {
    description: 'Security attribute template for DOs',
  },
  0xa3: {
    description: 'Interface and LCS dependent security attribute template',
  },
};

export default template;

export const dos = Object.keys(template);
