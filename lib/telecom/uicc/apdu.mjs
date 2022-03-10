// ETSI TS 102 221 V16.0.0 (2019-07)

// Table 10.5: Coding of Instruction Byte of the Commands for a telecom application
export default {
  0x04: {
    description: 'DEACTIVATE FILE',
    class: [0x00, 0x40, 0x60],
  },
  0x10: {
    description: 'TERMINAL PROFILE',
    class: [0x80],
  },
  0x12: {
    description: 'FETCH',
    class: [0x80],
  },
  0x14: {
    description: 'TERMINAL RESPONSE',
    class: [0x80],
  },
  0x20: {
    description: 'VERIFY PIN',
    class: [0x00, 0x40, 0x60],
  },
  0x24: {
    description: 'CHANGE PIN',
    class: [0x00, 0x40, 0x60],
  },
  0x26: {
    description: 'DISABLE PIN',
    class: [0x00, 0x40, 0x60],
  },
  0x28: {
    description: 'ENABLE PIN',
    class: [0x00, 0x40, 0x60],
  },
  0x32: {
    description: 'INCREASE',
    class: [0x80, 0xc0, 0xe0],
  },
  0x44: {
    description: 'ACTIVATE FILE',
    class: [0x00, 0x40, 0x60],
  },
  0x70: {
    description: 'MANAGE CHANNEL',
    class: [0x00, 0x40, 0x60],
  },
  0x73: {
    description: 'MANAGE SECURE CHANNEL',
    class: [0x00, 0x40, 0x60],
  },
  0x75: {
    description: 'TRANSACT DATA',
    class: [0x00, 0x40, 0x60],
  },
  0x76: {
    description: 'SUSPEND UICC',
    class: [0x80],
  },
  0x78: {
    description: 'GET IDENTITY',
    class: [0x80, 0xc0, 0xe0],
  },
  0x84: {
    description: 'GET CHALLENGE',
    class: [0x00, 0x40, 0x60],
  },
  0x88: {
    description: 'AUTHENTICATE',
    class: [0x00, 0x40, 0x60],
  },
  0x89: {
    description: 'AUTHENTICATE',
    class: [0x00, 0x40, 0x60],
  },
  0x2c: {
    description: 'UNBLOCK PIN',
    class: [0x00, 0x40, 0x60],
  },
  0xa2: {
    description: 'SEARCH RECORD',
    class: [0x00, 0x40, 0x60],
  },
  0xa4: {
    description: 'SELECT FILE',
    class: [0x00, 0x40, 0x60],
  },
  0xaa: {
    description: 'TERMINAL CAPABILITY',
    class: [0x80, 0xc0, 0xe0],
  },
  0xb0: {
    description: 'READ BINARY',
    class: [0x00, 0x40, 0x60],
  },
  0xb2: {
    description: 'READ RECORD',
    class: [0x00, 0x40, 0x60],
  },
  0xc2: {
    description: 'ENVELOPE',
    class: [0x80],
  },
  0xcb: {
    description: 'RETRIEVE DATA',
    class: [0x80, 0xc0, 0xe0],
  },
  0xd6: {
    description: 'UPDATE BINARY',
    class: [0x00, 0x40, 0x60],
  },
  0xdb: {
    description: 'SET DATA',
    class: [0x80, 0xc0, 0xe0],
  },
  0xdc: {
    description: 'UPDATE RECORD',
    class: [0x00, 0x40, 0x60],
  },
  0xf2: {
    description: 'STATUS',
    class: [0x80, 0xc0, 0xe0],
  },
};
