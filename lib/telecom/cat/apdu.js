// ETSI TS 102 221 V16.0.0 (2019-07)

// Table 10.5: Coding of Instruction Byte of the Commands for a telecom application
const commands = {
  0x10: {
    title: 'TERMINAL PROFILE',
    class: 0x80,
  },
  0xc2: {
    title: 'ENVELOPE',
    class: 0x80,
  },
  0x12: {
    title: 'FETCH',
    class: 0x80,
  },
  0x14: {
    title: 'TERMINAL RESPONSE',
    class: 0x80,
  },
};

module.exports = {
  commands,
};
