// ETSI TS 102 221 V16.0.0 (2019-07)
// 9.5.1 Access condition mapping

import Bitset from '../../../../../bitset.mjs';

const levels = {
  0: 'ALWays',
  1: 'User Verification (PIN)',
  2: 'User Verification (PIN2)',
  3: 'RFU',
  4: 'RFU',
  5: 'Proprietary Of Administrative Authority',
  6: 'Proprietary Of Administrative Authority',
  7: 'NEVer',
};

const accessConditions = {
  0x01: {
    description: 'PIN Appl 1',
    level: 1,
  },
  0x02: {
    description: 'PIN Appl 2',
    level: 1,
  },
  0x03: {
    description: 'PIN Appl 3',
    level: 1,
  },
  0x04: {
    description: 'PIN Appl 4',
    level: 1,
  },

  0x05: {
    description: 'PIN Appl 5',
    level: 1,
  },
  0x06: {
    description: 'PIN Appl 6',
    level: 1,
  },
  0x07: {
    description: 'PIN Appl 7',
    level: 1,
  },
  0x08: {
    description: 'PIN Appl 8',
    level: 1,
  },
  0x09: {
    description: 'RFU',
    level: 1,
  },

  0x0A: {
    description: 'ADM1',
    level: 5,
  },
  0x0B: {
    description: 'ADM2',
    level: 5,
  },
  0x0C: {
    description: 'ADM3',
    level: 5,
  },
  0x0D: {
    description: 'ADM4',
    level: 5,
  },
  0x0E: {
    description: 'ADM5',
    level: 5,
  },

  0x11: {
    description: 'PIN Universal PIN',
    level: 1,
  },

  0x12: {
    description: 'RFU (Global)',
    level: 3,
  },
  0x13: {
    description: 'RFU (Global)',
    level: 3,
  },
  0x14: {
    description: 'RFU (Global)',
    level: 3,
  },
  0x15: {
    description: 'RFU (Global)',
    level: 3,
  },
  0x16: {
    description: 'RFU (Global)',
    level: 3,
  },
  0x17: {
    description: 'RFU (Global)',
    level: 3,
  },
  0x18: {
    description: 'RFU (Global)',
    level: 3,
  },
  0x19: {
    description: 'RFU (Global)',
    level: 3,
  },
  0x1A: {
    description: 'RFU (Global)',
    level: 3,
  },
  0x1B: {
    description: 'RFU (Global)',
    level: 3,
  },
  0x1C: {
    description: 'RFU (Global)',
    level: 3,
  },
  0x1D: {
    description: 'RFU (Global)',
    level: 3,
  },
  0x1E: {
    description: 'RFU (Global)',
    level: 3,
  },

  0x81: {
    description: 'PIN2 Appl 1',
    level: 2,
  },
  0x82: {
    description: 'PIN2 Appl 2',
    level: 2,
  },
  0x83: {
    description: 'PIN2 Appl 3',
    level: 2,
  },
  0x84: {
    description: 'PIN2 Appl 4',
    level: 2,
  },

  0x85: {
    description: 'PIN2 Appl 5',
    level: 2,
  },
  0x86: {
    description: 'PIN2 Appl 6',
    level: 2,
  },
  0x87: {
    description: 'PIN2 Appl 7',
    level: 2,
  },
  0x88: {
    description: 'PIN2 Appl 8',
    level: 2,
  },
  0x89: {
    description: 'RFU',
    level: 2,
  },

  0x8A: {
    description: 'ADM6',
    level: 6,
  },
  0x8B: {
    description: 'ADM7',
    level: 6,
  },
  0x8C: {
    description: 'ADM8',
    level: 6,
  },
  0x8D: {
    description: 'ADM9',
    level: 6,
  },
  0x8E: {
    description: 'ADM10',
    level: 6,
  },

  0x90: {
    description: 'RFU (Local)',
    level: 4,
  },
  0x91: {
    description: 'RFU (Local)',
    level: 4,
  },
  0x92: {
    description: 'RFU (Local)',
    level: 4,
  },
  0x93: {
    description: 'RFU (Local)',
    level: 4,
  },
  0x94: {
    description: 'RFU (Local)',
    level: 4,
  },
  0x95: {
    description: 'RFU (Local)',
    level: 4,
  },
  0x96: {
    description: 'RFU (Local)',
    level: 4,
  },
  0x97: {
    description: 'RFU (Local)',
    level: 4,
  },
  0x98: {
    description: 'RFU (Local)',
    level: 4,
  },
  0x99: {
    description: 'RFU (Local)',
    level: 4,
  },
  0x9A: {
    description: 'RFU (Local)',
    level: 4,
  },
  0x9B: {
    description: 'RFU (Local)',
    level: 4,
  },
  0x9C: {
    description: 'RFU (Local)',
    level: 4,
  },
  0x9D: {
    description: 'RFU (Local)',
    level: 4,
  },
  0x9E: {
    description: 'RFU (Local)',
    level: 4,
  },
};

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  return Bitset.from(data);
}

export function inspect(data) {
  const accessCondition = accessConditions[data[0]];
  accessCondition.level = levels[accessCondition.level];
  return accessCondition;
}
